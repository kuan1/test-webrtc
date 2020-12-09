const video = document.querySelector('#video')

const pc = new window.RTCPeerConnection()

// 获取icecondidate
let icecandidades = []
function getCandidades() {
  if (icecandidades.length) return icecandidades
  let tmp = []
  return new Promise(resolve => {
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
  condidates.forEach(condidate => {
    pc.addIceCandidate(new RTCIceCandidate(condidate))
  })
}

// 创建offer
async function createOffer() {
  const offer = await pc.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  })
  await pc.setLocalDescription(offer)
  return pc.localDescription
}

// 接收到流
pc.onaddstream = function (e) {
  console.log('add stream', e.stream)
  video.srcObject = e.stream
}

// 设置远程answer setRemoteDescription
async function setRemote(answer) {
  await pc.setRemoteDescription(answer)
  console.log('p2p 链接建立成功')
}

// 初始化
async function init() {
  const [condidades, offer] = await Promise.all([
    getCandidades(),
    createOffer()
  ])
  // console.log('condidade', JSON.stringify(condidades))
  // console.log('offer', JSON.stringify(offer))
  return { condidades, offer }
}

// 响应远程信息
function accessRemote({ condidades = [], answer = {} }) {
  setRemote(answer)
  addIceCandidate(condidades)
}
