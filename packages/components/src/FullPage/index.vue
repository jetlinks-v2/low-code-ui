<template>
  <div class='full-page-warp' ref='fullPage' :style='{ [attrName]: `calc(100vh - ${y + 24}px)`}'>
    <div class="full-page-warp-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang='ts' name='FullPage'>
import {computed, ref} from 'vue'
import { useElementBounding } from '@vueuse/core'

const props = defineProps({
  minHeight: {
    type: Boolean,
    default: true
  }
})

const fullPage = ref(null)
const { y } = useElementBounding(fullPage)

const attrName = computed(() => {
  console.log(props.minHeight)
  return props.minHeight ? 'minHeight' : 'height'
})

</script>

<style scoped lang="less">
.full-page-warp {
  background: #fff;
  display: flex;
  .full-page-warp-content {
    width: 100%;
  }
}

</style>
