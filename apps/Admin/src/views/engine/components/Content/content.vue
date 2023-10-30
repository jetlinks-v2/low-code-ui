<template xmlns="">
  <div class="content-warp">
    <ProjectEmpty v-if="props.data.type === 'project'" :data="data"/>
    <Project v-else-if="props.data.type === providerEnum.Module" :data="props.data.children" />
    <FormDesigner v-else-if="props.data.type === providerEnum.FormPage" :data="props.data"  />
    <CustomHTML v-else-if="data.type === providerEnum.HtmlPage" :data="props.data"/>
    <CRUD v-else-if="data.type === providerEnum.CRUD" v-bind="data"/>
    <ListPage v-else-if="data.type === providerEnum.ListPage" :data="props.data"/>
    <SQLCode v-else-if="data.type === providerEnum.SQL"  v-bind="data"/>
    <FunctionCode v-else-if="data.type === providerEnum.Function"  v-bind="data"/>
  </div>
</template>

<script setup name="ContentWarp">
import { providerEnum } from '@/components/ProJect/index'
import ProjectEmpty from '@/components/ProJect/Empty/index.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
})

</script>

<style scoped lang="less">
.content-warp {
  height: 100%;
}
</style>
