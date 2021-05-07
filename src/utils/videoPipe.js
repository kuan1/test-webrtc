import { setTransitionHooks, unref } from 'vue'
import { state, localVideo, remoteVideo, extra } from '@/store'
import { sendOffer, sendAnswer } from '@/utils/ws'

class VideoPipe {
  constructor(localVideo, remoteVideo, localCode, remoteCode, constraints) {
    this.constraints = { audio: true, video: true, ...constraints }
    this.stream = null
    this.localVideo = localVideo
    this.remoteVideo = remoteVideo
    this.localCode = localCode
    this.remoteCode = remoteCode

    this.pc = new RTCPeerConnection()
    this.pc.onaddstream = function (e) {
      const video = unref(remoteVideo)
      if (video) {
        video.srcObject = e.stream
        video.play()
      }
    }
    this.icecandidades = [] // local icecandidades
    this.readyCallbacks = []

    this.getStream()
  }

  ready() {
    if (this.stream) return true
    return new Promise((resolve) => {
      this.readyCallbacks.push(resolve)
    })
  }

  getStream = () => {
    navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then((stream) => {
        this.stream = stream
        this.localVideo.srcObject = stream
        this.pc.addStream(stream)

        // 通知ready
        this.readyCallbacks.forEach((resolve) => resolve())
        this.readyCallbacks = []
      })
      .catch(handleError('getStream'))
  }

  async getOfferAndIcecandidades() {
    await this.ready()
    const [icecandidades, offer] = await Promise.all([this.getCandidades(), this.createOffer()])
    return { icecandidades, offer }
  }
  async getAnswerAndIcecandidades(data) {
    await this.ready()
    const [icecandidades, answer] = await Promise.all([this.getCandidades(), this.createAnswer(data.offer)])
    data.icecandidades.forEach((condidate) => this.pc.addIceCandidate(new RTCIceCandidate(condidate)))
    // console.log('condidade', JSON.stringify(condidades))
    // console.log('offer', JSON.stringify(offer))
    return { icecandidades, answer }
  }

  // 响应answer
  accessAnswer = ({ icecandidades = [], answer = {} }) => {
    icecandidades.forEach((condidate) => this.pc.addIceCandidate(new RTCIceCandidate(condidate)))
    this.pc.setRemoteDescription(answer)
  }

  createOffer = () => {
    return this.pc
      .createOffer({
        offerToReceiveAudio: this.constraints.audio ? 1 : 0,
        offerToReceiveVideo: this.constraints.video ? 1 : 0,
      })
      .then((desc) => {
        this.pc.setLocalDescription(desc)
        return desc
      })
      .catch(handleError('createOffer'))
  }

  getCandidades = () => {
    if (this.icecandidades.length) return this.icecandidades
    let tmp = []
    return new Promise((resolve) => {
      this.pc.onicecandidate = (e) => {
        if (e.candidate) {
          tmp.push(e.candidate)
        } else {
          this.icecandidades = tmp
          resolve(this.icecandidades)
        }
      }
    })
  }

  createAnswer = async (offer) => {
    try {
      const pc = this.pc
      await pc.setRemoteDescription(offer)
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      return answer
    } catch (e) {
      return handleError('createAnswer')(e)
    }
  }

  close = () => {
    this.pc.close()
    this.pc = null
    this.localVideo = null
    this.remoteVideo = null
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
    }
    this.stream = null
  }
}

function handleError(type) {
  return (error) => {
    console.log(type, error)
    return Promise.reject(error)
  }
}

// 初始化视频通话
let videoPipe
export const initVideoPipe = async () => {
  if (videoPipe) return videoPipe
  videoPipe = new VideoPipe(unref(localVideo), unref(remoteVideo), state.localCode, state.remoteCode)
  // 拨打电话
  if (state.type === 'offer') {
    const { icecandidades, offer } = await videoPipe.getOfferAndIcecandidades()
    return sendOffer({ icecandidades, offer })
  }
  // 接电话
  if (state.type === 'answer') {
    const { icecandidades, answer } = await videoPipe.getAnswerAndIcecandidades(extra.offer)
    return sendAnswer({ icecandidades, answer })
  }
}

export const accessAnswer = ({ addIceCandidate, answer }) => {
  if (!videoPipe) return
  videoPipe.accessAnswer({ addIceCandidate, answer })
}

// 关闭视频通话
export const closeVideoPipe = () => {
  if (!videoPipe) return
  videoPipe.close()
  videoPipe = null
}
