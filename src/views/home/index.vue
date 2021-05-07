<template>
  <div class="entry">
    <router-link :to="{ name: 'video' }">
      <button class="halo-btn">视频通话</button>
    </router-link>
    <router-link :to="{ name: 'data' }">
      <button class="halo-btn">文字聊天</button>
    </router-link>
    <router-link :to="{ name: 'test' }" v-if="isDev">
      <button class="halo-btn">测试页面</button>
    </router-link>
  </div>
</template>

<script>
export default {
  setup() {
    return {
      isDev: process.env.NODE_ENV === "development",
    };
  },
};
</script>

<style lang="less" scoped>
.entry {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 20px;
  .halo-btn {
    margin: 10px auto;
  }
}
</style>