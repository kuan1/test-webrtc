import { toast } from '@halobear/js-feedback'

import { state, extra } from '@/store'

import { accessAnswer, closeVideoPipe } from './videoPipe'

const ws = new WebSocket(`wss://www.luzhongkuan.cn/websocket?code=${state.localCode}`)
// const ws = new WebSocket(`ws://localhost:8001/websocket?code=${state.localCode}`)

let timer
// nginx 默认一分钟断开链接
ws.onopen = () => {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    ws.send('ping')
  }, 50 * 1000)
}

ws.onmessage = (e) => {
  const { success, data, event, fromUser } = json(e.data)
  console.log('socket->', data)

  // 反馈失败
  if (!success) {
    return toast(data)
  }

  // 连接成功
  if (event === 'connect') {
    return (state.localCode = data.code)
  }

  if (event === 'friendClose' && state.type) {
    toast('连接对象断开')
    return closeVideoPipe()
  }

  // 发送offer失败 或者发送answer失败
  if (event === 'send offer fail' || event === 'send answer fail') {
    toast('连接对象未找到')
    state.remoteCode = ''
    return closeVideoPipe()
  }

  const { action } = data || {}
  switch (action) {
    case 'answer':
      accessAnswer(data)
      break
    case 'offer':
      state.remoteCode = fromUser
      state.type = 'answer'
      extra.offer = data
      break
    default:
      break
  }
}

ws.onclose = () => {
  if (timer) clearInterval(timer)
  closeVideoPipe()
}

function sendToUser(data, event = 'toUser', toUser = state.remoteCode) {
  if (!toUser) return console.error('toUser is null')
  ws.send(JSON.stringify({ data, toUser, event }))
}

export const sendOffer = ({ icecandidades, offer }) => {
  sendToUser({ icecandidades, offer, action: 'offer' }, 'sendOffer')
}

export const sendAnswer = ({ icecandidades, answer }) => {
  sendToUser({ icecandidades, answer, action: 'answer' }, 'sendAnswer')
}

export const closeVideo = () => {
  sendToUser({}, 'friendClose')
}

export default ws

function json(text = '') {
  try {
    return JSON.parse(text)
  } catch (e) {
    return {}
  }
}
