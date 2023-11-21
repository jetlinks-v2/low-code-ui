<template>
  <div class="check-spinning" v-if="spinning">
    <div class="content">
      <img src="/images/list-page/loading-blue.png" class="loading-img" />
      <p class="content-text">{{ content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  spinning: {
    type: Boolean,
    default: false,
  },
  content: {
    type: String,
    default: '校验中',
  },
})
</script>

<style scoped lang="less">
.check-spinning {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1040;
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    display: flex;
    align-items: center;
    .loading-img {
      animation: circle 1s linear infinite;
      @keyframes circle {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }
    .content-text {
      color: @primary-color;
      margin: 0;
    }
  }
}
</style>
