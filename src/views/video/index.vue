<template>
  <div class="container">
    <header class="header ellipsis">我的账号: {{ code }}</header>

    <input placeholder="输入要好友账号" class="halo-input" v-model="tmpCode" />

    <div class="buttons">
      <button class="halo-btn" @click="copy">复制我的账号</button>
      <button
        class="halo-btn halo-btn-primary"
        :disabled="!(tmpCode || friendCode)"
        @click="callFriend"
      >
        拨打好友账号
      </button>
    </div>
  </div>

  <video-contact
    v-if="friendCode"
    :type="type"
    :code="friendCode"
    :offer="offer"
    @offer="sendOffer"
    @answer="sendAnswer"
  />
</template>

<script>
import { ref } from "vue";
import copy from "@halobear/utils/copy";
import { toast } from "@halobear/js-feedback";

import useSocket from "@/use/use-socket";
import useRTC from "@/use/use-rtc";

import VideoContact from "./video-contact.vue";

export default {
  components: {
    VideoContact,
  },
  setup() {
    const {
      type,
      code,
      friendCode,
      tmpCode,
      sendOffer,
      sendAnswer,
      answer,
      offer,
    } = useSocket();

    const callFriend = () => {
      if (!tmpCode.value) return toast("请输入好友账号");
      if (tmpCode.value === code.value) return toast("不可以给自己打电话");
      friendCode.value = tmpCode.value;
      type.value = "offer";
    };

    return {
      type,
      code,
      friendCode,
      tmpCode,
      sendOffer,
      sendAnswer,
      offer,
      callFriend,
      copy: () => {
        const success = copy(code.value);
        success && toast("复制成功");
      },
    };
  },
};
</script>

<style lang="less">
@import "@/styles/variable.less";

.container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #f7f7f7;
}
.header {
  height: 50px;
  line-height: 50px;
  padding: 0 15px;
  background-color: #fff;
}
.halo-input {
  width: 90%;
  max-width: 500px;
  margin: 30px auto;
  display: block;
}
.buttons {
  margin: 0 auto;
  width: 90%;
  max-width: 300px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>