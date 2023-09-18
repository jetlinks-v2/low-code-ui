<template>
  <div :class="boxClass" :style="styles">
    <slot></slot>
  </div>
</template>

<script setup name="CardBox">
import classNames from "ant-design-vue/es/_util/classNames";

const props = defineProps({
  class: {
    type: [Array, String],
    default: undefined
  },
  padding: {
    type: String,
    default: '24px'
  },
  bgColor: {
    type: String,
    default: '#fff'
  },
  borderRadius: {
    type: Number,
    default: 8
  }
})

const boxClass = computed(() => {
  return classNames(props.class, 'card-box')
})

const styles = computed(() => {
  return {
    padding: props.padding,
    borderRadius: props.borderRadius + 'px',
    backgroundColor: props.bgColor
  }
})

</script>

<style scoped lang="less">

</style>
