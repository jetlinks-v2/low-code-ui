<template xmlns="">
  <div class="content-warp">
    <ProjectEmpty v-if="props.data.type === 'project'" :data="data"/>
    <Project v-else-if="props.data.type === providerEnum.Module" :data="props.data.children"/>
    <FormDesigner v-else-if="props.data.type === providerEnum.FormPage" :data="props.data"/>
    <CustomHTML v-else-if="data.type === providerEnum.HtmlPage" :data="props.data"/>
    <CRUD v-else-if="data.type === providerEnum.CRUD" v-bind="data"/>
    <ListPage v-else-if="data.type === providerEnum.ListPage" :data="props.data"/>
    <SQLCode v-else-if="data.type === providerEnum.SQL" v-bind="data"/>
    <FunctionCode v-else-if="data.type === providerEnum.Function" v-bind="data"/>
    <PageDesigner v-else-if="data.type === providerEnum.PageDesign" :data="props.data"/>
    <CIAE v-else-if="data.type === providerEnum.CIAE" v-bind="data"/>
  </div>
</template>

<script setup name="ContentWarp">
import {providerEnum} from '@LowCode/components/ProJect/index'
import ProjectEmpty from '@LowCode/components/ProJect/Empty/index.vue'
import {
  ListPage,
  CRUD,
  Project,
  SQLCode,
  FunctionCode,
  PageDesigner,
  FormDesigner,
  CustomHTML,
  CIAE
} from '@LowCode/components/index'

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
