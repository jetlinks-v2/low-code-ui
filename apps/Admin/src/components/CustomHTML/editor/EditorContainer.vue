<script setup lang="ts">
const $slots = useSlots()
defineProps({
  title: String,
})
</script>

<template>
  <div class="editor-container">
    <div class="title">
      <slot name="title"></slot>
      {{ $slots.title ? '' : title }}
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.editor-container {
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: #1e1e1e;
  .title {
    padding: 5px;
    color: #fff;
    border-bottom: 1px #2a2a2a solid;
    display: flex;
    justify-content: flex-start;
  }

  .content {
    height: calc(100% - 36px);
  }
}
</style>
