const WebSocket = require('ws')
const uuid = require('uuid')
const qs = require('qs')

let connection = []

const getJSON = (data) => {
  try {
    return JSON.parse(data)
  } catch (e) {
    console.error(e)
    return {}
  }
}

function createChatserver(server) {
  const wss = new WebSocket.Server({ server })

  wss.on('connection', function (ws, req) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

    const code = qs.parse(req.url.split('?')[1]).code || uuid.v4()

    const currentUser = { code, ip, ws, friend: '' }

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
      if (text === 'ping') return ws.send('pong')
      const { data, event, toUser } = getJSON(text)
      switch (event) {
        case 'toUser':
          sendToUser(data, toUser, code)
          break
        case 'sendOffer':
          currentUser.friend = toUser
          sendOffer(ws, data, toUser, code)
          break
        case 'sendAnswer':
          currentUser.friend = toUser
          sendAnswer(ws, data, toUser, code)
          break
        case 'friendClose':
          sendToUser({ friend: currentUser.friend }, currentUser.friend, code, 'friendClose')
          currentUser.friend = ''
          break
        default:
          ws.success(data, 'message')
      }
    })

    // 关闭
    ws.on('close', () => {
      const closedConnection = connection.filter(({ ws }) => ws.readyState === ws.CLOSED)
      // 通知关闭
      closedConnection.forEach(({ code, friend }) => {
        sendToUser({ friend: code }, friend, code, 'friendClose')
      })

      connection = connection.filter(({ ws }) => ws.readyState !== ws.CLOSED)
    })
  })
}

// 发送信息
function sendToUser(data, toUser, fromUser, event = 'message') {
  if (!toUser) return
  if (toUser === '*') {
    return connection.forEach(({ ws }) => {
      ws.success(data, event, fromUser)
    })
  }
  if (toUser) {
    const { ws } = connection.find((item) => item.code === toUser) || {}
    ws && ws.success(data, event, fromUser)
  }
}

// 发送offer
function sendOffer(ws, data, toUser, fromUser) {
  let connect = toUser && connection.find((item) => item.code === toUser)
  if (!connect) {
    return ws.success({}, 'send offer fail')
  }
  sendToUser(data, toUser, fromUser)
}

// 回复answer
function sendAnswer(ws, data, toUser, fromUser) {
  let connect = toUser && connection.find((item) => item.code === toUser)
  if (!connect) {
    return ws.success({}, 'send answer fail')
  }
  sendToUser(data, toUser, fromUser)
}

module.exports = {
  createChatserver,
  sendToUser,
}
