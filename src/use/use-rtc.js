import { onBeforeUnmount, ref, unref } from 'vue'

export default () => {
  // 当前的用户video
  const userVideoRef = ref()
  // 链接对象的video
  const receiveVideoRef = ref()

  // 链接对象
  const pc = new window.RTCPeerConnection()

  // 接收到流
  pc.onaddstream = function (e) {
    const video = unref(receiveVideoRef)
    if (video) {
      video.srcObject = e.stream
      video.play()
    }
  }

  // 获取icecondidate
  let icecandidades = []
  const getCandidades = async () => {
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
  const addIceCandidate = async (condidates = []) => {
    condidates.forEach((condidate) => {
      pc.addIceCandidate(new RTCIceCandidate(condidate))
    })
  }

  // 创建offer
  const createOffer = async () => {
    // 添加视频流
    const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true })

    // 小窗口播放自己的视频
    const video = unref(userVideoRef)
    video.srcObject = stream
    video.play()

    pc.addStream(stream)

    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    })

    await pc.setLocalDescription(offer)
    return pc.localDescription
  }

  // 获取condidades、offer
  const getCondidatesAndOffer = async () => {
    const [condidades, offer] = await Promise.all([getCandidades(), createOffer()])
    // console.log('condidade', JSON.stringify(condidades))
    // console.log('offer', JSON.stringify(offer))
    return { condidades, offer }
  }

  // 响应answer
  const accessAnswer = (window.accessAnswer = ({ condidades = [], answer = {} }) => {
    addIceCandidate(condidades)
    pc.setRemoteDescription(answer)
  })

  // 创建answer
  const createAnswer = async (offer) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true })

    // 小窗口播放自己的视频
    const video = unref(userVideoRef)
    video.srcObject = stream
    video.play()

    pc.addStream(stream)
    await pc.setRemoteDescription(offer)
    await pc.setLocalDescription(await pc.createAnswer())
    return pc.localDescription
  }

  // 初始化
  const startAnswer = async (data) => {
    const [condidades, answer] = await Promise.all([getCandidades(), createAnswer(data.offer)])
    addIceCandidate(data.condidades)
    // console.log('condidade', JSON.stringify(condidades))
    // console.log('offer', JSON.stringify(offer))
    return { condidades, answer }
  }

  onBeforeUnmount(() => {
    window.accessAnswer = null
  })

  return {
    userVideoRef,
    receiveVideoRef,
    getCondidatesAndOffer,
    accessAnswer,
    startAnswer,
  }
}
