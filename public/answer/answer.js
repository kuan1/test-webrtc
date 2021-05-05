const video = document.querySelector('#video')
const pc = new window.RTCPeerConnection()

// 接收到流
pc.onaddstream = function (e) {
  console.log('add stream', e.stream)
  video.srcObject = e.stream
}

// 获取icecondidate
let icecandidades = []
function getCandidades() {
  if (icecandidades.length) return icecandidades
  let tmp = []
  return new Promise((resolve) => {
    pc.onicecandidate = function (e) {
      if (e.candidate) {
        tmp.push(e.candidate)
      } else {
        icecandidades = tmp
        resolve(icecandidades)
      }
    }
  })
}

// 添加icecondidate
function addIceCandidate(condidates = []) {
  condidates.forEach((condidate) => {
    pc.addIceCandidate(new RTCIceCandidate(condidate))
  })
}

// 创建rtc响应
async function createAnswer(offer) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true })
  // const stream = await navigator.mediaDevices.getDisplayMedia({
  //   video: true,
  //   audio: false
  // })
  pc.addStream(stream)
  // video.srcObject = stream
  await pc.setRemoteDescription(offer)
  await pc.setLocalDescription(await pc.createAnswer())
  return pc.localDescription
}

// 初始化
async function startAnswer(data) {
  const [condidades, answer] = await Promise.all([getCandidades(), createAnswer(data.offer)])
  addIceCandidate(data.condidades)
  // console.log('condidade', JSON.stringify(condidades))
  // console.log('offer', JSON.stringify(offer))
  return { condidades, answer }
}
