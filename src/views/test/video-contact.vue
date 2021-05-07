<template>
  <div>
    <video ref="remoteVideo" class="remote-video" autoplay />
    <video ref="localVideo" class="local-video" autoplay />

    <!-- <button
      v-if="state.confirm === 'offer'"
      class="halo-btn halo-btn-primary"
      @click="confirmOffer"
    >
      确定链接
    </button> -->
  </div>
</template>

<script>
import { onBeforeUnmount, onMounted } from "vue";
import { localVideo, remoteVideo, extra } from "@/store";

import { initVideoPipe, closeVideoPipe } from "@/utils/videoPipe";

export default {
  setup() {
    const confirmOffer = () => {};

    onMounted(initVideoPipe);

    onBeforeUnmount(closeVideoPipe);

    return {
      localVideo,
      remoteVideo,
    };
  },
};
</script>

<style lang="less" scoped>
.remote-video {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: black;
}

.local-video {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 100px;
  height: 100px;
  z-index: 100;
  background-color: rgba(#333, 0.7);
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.018);
}
</style>