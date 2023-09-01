<template>
  <ResizeObserver @resize="resize">
    <slot></slot>
  </ResizeObserver>
</template>

<script setup name="DragContent">
import ResizeObserver from 'ant-design-vue/lib/vc-resize-observer';
import { provide } from 'vue'
import { DRAG_PROVIDE } from './data'

const width = ref(0)

provide(DRAG_PROVIDE, width)
const resize = (e) => {
  // console.log(e)
  width.value = e.width
}

</script>

<style scoped>

</style>
