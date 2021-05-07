import { reactive, watch, ref } from 'vue'

import user from '@/utils/user'
import friend from '@/utils/friend'

export const extra = {
  answer: {},
  offer: {},
}

export const state = reactive({
  type: '', // offer answer 空闲状态 拨打电话、接听电话
  localCode: user.code, // 本地账号
  remoteCode: friend.code, // 远程账号
  confirm: '', // offer answer
})

export const localVideo = ref() // 本地视频
export const remoteVideo = ref() // 远程视频

watch(
  () => state.localCode,
  (code) => (user.code = code)
)

watch(
  () => state.remoteCode,
  (code) => (friend.code = code)
)
