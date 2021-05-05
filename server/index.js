const WebSocket = require('ws')
const uuid = require('uuid')
const qs = require('qs')

const PORT = 8099

let connection = []

const getJSON = (data) => {
  try {
    return JSON.parse(data)
  } catch (e) {
    console.error(e)
    return {}
  }
}

const wss = new WebSocket.Server({ port: PORT })

wss.on('connection', function (ws, req) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  const code = qs.parse(req.url.split('?')[1]).code || uuid.v4()

  const currentUser = { code, ip, ws, extra: {} }

  connection.push(currentUser)

  ws.success = (data = {}, event = 'message', fromUser) => {
    ws.send(JSON.stringify({ success: true, data, event, fromUser }))
  }
  ws.error = (data = {}, event = 'message') => {
    ws.send(JSON.stringify({ success: false, data, event }))
  }

  // 连接成功
  ws.success({ code, ip }, 'connect')

  // 接收到信息
  ws.on('message', (text) => {
    if (!text) return
    const { data, event, toUser } = getJSON(text)
    switch (event) {
      case 'toUser':
        sendToUser(data, toUser, code)
        break
      case 'saveData':
        currentUser.extra = data
        console.log(data)
        ws.success('数据保存成功', 'saveData')
        break
      case 'queryData':
        const target = connection.find((item) => item.code === toUser || code)
        if (target) {
          ws.success(target.extra, 'queryData')
        } else {
          ws.error('数据未找到', 'queryData')
        }
        break
      default:
        ws.success(data, 'message')
    }
  })

  // 关闭
  ws.on('close', () => {
    connection = connection.filter(({ ws }) => ws.readyState === ws.OPEN)
  })
})

function sendToUser(data, toUser, fromUser) {
  if (toUser) {
    const { ws, code } = connection.find((item) => item.code === toUser) || {}
    ws && ws.success(data, 'message', fromUser)
  } else {
    connection.forEach(({ ws }) => {
      ws.success(data, 'message', fromUser)
    })
  }
}

console.log(`ws://localhost:${PORT}`)
