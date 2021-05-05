/**
 * 创建offer
 * 接收answer
 */

// 创建offer
document.querySelector('.start').onclick = sendOffer

function onMessage({ data, event }) {
  console.log(event, data)
  switch (event) {
    case 'connect':
      user.code = data.code
      document.querySelector('.user').value = data.code
      break
    default:
      const { action } = data || {}
      console.log(action, data)
      // 接受answer
      if (action === 'answer') {
        accessAnswer(data)
      }
  }
}

const user = {
  key: 'USER_CODE',
  _code: '',
  get code() {
    if (!this._code) {
      this._code = localStorage.getItem(this.key)
    }
    return this._code || ''
  },
  set code(code) {
    if (code == this._code) return
    this._code = code
    localStorage.setItem(this.key, code)
  },
}

// 连接socket
const ws = new WebSocket(`ws://121.36.255.88:8001?code=${user.code}`)
ws.onmessage = (e) => {
  const { success, data, event } = json(e.data)

  if (!success) {
    return alert(data)
  }
  onMessage({ data, event })
}

async function sendOffer() {
  const { condidades, offer } = await startOffer()
  ws.send(
    JSON.stringify({
      data: { condidades, offer, action: 'offer' },
      event: 'toUser',
      toUser: document.querySelector('.toUser').value,
    })
  )
  console.log(condidades, offer)
}

function json(text = '') {
  try {
    return JSON.parse(text)
  } catch (e) {
    return {}
  }
}
