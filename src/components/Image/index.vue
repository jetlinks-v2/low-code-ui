<template>
  <j-image
    :preview="false"
    v-bind="props"
    :fallback="errorImage"
  />
</template>

<script setup name="Image">
import { imageProps } from 'ant-design-vue/es/image'
import { defaultImage, errorImage} from './data'

const props = defineProps({
  ...imageProps(),
  src: {
    type: String,
    default: defaultImage
  }
})
</script>

<style scoped>

</style>
