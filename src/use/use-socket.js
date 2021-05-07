import { onBeforeUnmount, ref } from 'vue'
import { Modal } from 'ant-design-vue'

import user from '@/utils/user'
import friend from '@/utils/friend'
import { toast } from '@halobear/js-feedback'

export default () => {
  const type = ref('offer') // offer answer
  const code = ref(user.code)
  const friendCode = ref()
  const tmpCode = ref(friend.code)
  const offer = ref({}) // 接收到的offer

  const ws = new WebSocket(`wss://www.luzhongkuan.cn/websocket?code=${user.code}`)

  ws.onmessage = (e) => {
    const { success, data, event, fromUser } = json(e.data)

    if (!success) {
      return alert(data)
    }

    switch (event) {
      case 'connect':
        code.value = user.code = data.code
        break
      default:
        const { action } = data || {}
        // 接收answer
        if (action === 'answer') {
        }
        // 接收offer
        if (action === 'offer') {
          if (friendCode.value) {
            // 占线了
            toast(`${fromUser}来电`)
          } else {
            type.value = 'answer'
            offer.value = data
            friendCode.value = fromUser
          }
        }
    }
  }

  const sendOffer = ({ condidades, offer }) => {
    // 保存localStorage
    friend.code = friendCode.value
    ws.send(
      JSON.stringify({
        data: { condidades, offer, action: 'offer' },
        toUser: friendCode.value,
        event: 'toUser',
      })
    )
  }

  const sendAnswer = ({ condidades, answer }) => {
    ws.send(
      JSON.stringify({ data: { condidades, answer, action: 'answer' }, toUser: friendCode.value, event: 'toUser' })
    )
  }

  onBeforeUnmount(() => {
    ws.close()
  })

  return {
    type,
    code,
    friendCode,
    tmpCode,
    offer,
    ws,
    sendOffer,
    sendAnswer,
  }
}

function json(text = '') {
  try {
    return JSON.parse(text)
  } catch (e) {
    return {}
  }
}
