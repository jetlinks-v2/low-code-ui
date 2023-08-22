<script setup lang="ts">
import { ref } from 'vue'
defineProps({
  title: String,
})
</script>

<template>
  <div class="editor-container">
    <div class="title">{{ title }}</div>
    <slot></slot>
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
  }
}
</style>
