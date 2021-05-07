import { toast } from '@halobear/js-feedback'

import { state, extra } from '@/store'

import { accessAnswer } from './videoPipe'

const ws = new WebSocket(`wss://www.luzhongkuan.cn/websocket?code=${state.localCode}`)

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

  // 发送offer失败 或者发送answer失败
  if (event === 'send offer fail' || event === 'send answer fail') {
    toast('连接对象未找到')
    state.remoteCode = ''
    state.type = ''
    return
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

export default ws

function json(text = '') {
  try {
    return JSON.parse(text)
  } catch (e) {
    return {}
  }
}
