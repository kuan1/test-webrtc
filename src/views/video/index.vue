<template>
  <div class="container">
    <header class="header ellipsis">我的账号: {{ state.localCode }}</header>

    <input placeholder="输入要好友账号" class="halo-input" v-model="tmpCode" />

    <div class="buttons">
      <button class="halo-btn" @click="copy">复制邀请连接</button>
      <button
        class="halo-btn halo-btn-primary"
        :disabled="!(tmpCode || state.remoteCode)"
        @click="callFriend"
      >
        拨打好友视频
      </button>
    </div>
  </div>

  <video-contact v-if="state.type" :type="state.type" />
</template>

<script>
import { onMounted, ref } from "vue";
import copy from "@halobear/utils/copy";
import { toast } from "@halobear/js-feedback";
import { useRoute } from "vue-router";

import { state } from "@/store";

import VideoContact from "./video-contact.vue";

export default {
  components: {
    VideoContact,
  },
  setup() {
    const tmpCode = ref(state.remoteCode);
    const route = useRoute();

    const callFriend = () => {
      if (!tmpCode.value) return toast("请输入好友账号");
      if (tmpCode.value === state.localCode) return toast("不可以给自己打电话");
      state.remoteCode = tmpCode.value;
      state.type = "offer";
    };
    onMounted(() => {
      const { friend } = route.query;
      if (friend) {
        state.remoteCode = friend;
        tmpCode.value = friend;
      }
    });

    return {
      state,
      tmpCode,
      callFriend,
      copy() {
        const success = copy(
          `${window.location.origin}${location.pathname}#/video?friend=${state.localCode}`
        );
        success && toast("复制成功");
      },
    };
  },
};
</script>

<style lang="less" scoped>
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