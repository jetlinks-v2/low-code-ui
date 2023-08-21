<template>
  <div class="content-warp">
    <Project v-if="props.data.type === providerEnum.Module" :data="props.data.children" />
    <FormDesigner v-else-if="props.data.type === providerEnum.FormPage" />
    <CRUD v-else-if="data.type === providerEnum.CRUD" />
  </div>
</template>

<script setup name="ContentWarp">
import { providerEnum } from '@/components/ProJect/index'

const props = defineProps({
  data: {
    type: Object,
    default: {}
  },
})

</script>

<style scoped lang="less">
.content-warp {
  height: 100%;
}
</style>
