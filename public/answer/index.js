async function onMessage({ data = {}, event, fromUser }) {
  console.log(event, data)
  switch (event) {
    case 'connect':
      user.code = data.code
      document.querySelector('.user').value = data.code
      break
    default:
      const { action } = data
      if (action === 'offer') {
        const { condidades, answer } = await startAnswer(data)
        ws.send(JSON.stringify({ data: { condidades, answer, action: 'answer' }, toUser: fromUser, event: 'toUser' }))
      }
      break
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

function json(text = '') {
  try {
    return JSON.parse(text)
  } catch (e) {
    return {}
  }
}

const ws = new WebSocket(`ws://121.36.255.88:8001?code=${user.code}`)

ws.onmessage = (e) => {
  const { success, data, event, fromUser } = json(e.data)

  if (!success) {
    return alert(data)
  }
  onMessage({ data, event, fromUser })
}
