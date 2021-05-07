<template>
  <div class="video-outer">
    <video ref="userVideoRef" class="user-video" autoplay />
    <video ref="receiveVideoRef" class="friend-video" autoplay />
  </div>
</template>

<script>
import { onBeforeUnmount, onMounted, watch } from "vue";

import useRTC from "@/use/use-rtc";

export default {
  props: {
    type: {
      type: String,
      default: "offer", // answer
    },
    code: {
      type: String,
      default: "",
    },
    offer: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const {
      userVideoRef,
      receiveVideoRef,
      getCondidatesAndOffer,
      startAnswer,
    } = useRTC();

    const sendOffer = async () => {
      const { condidades, offer } = await getCondidatesAndOffer();
      emit("offer", { condidades, offer });
    };

    const sendAnswer = async () => {
      const { condidades, answer } = await startAnswer(props.offer);
      emit("answer", { condidades, answer });
    };

    onMounted(() => {
      props.type === "offer" ? sendOffer() : sendAnswer();
    });

    return {
      userVideoRef,
      receiveVideoRef,
    };
  },
};
</script>

<style lang="less" scoped>
.video-outer,
.friend-video {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: black;
}

.user-video {
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