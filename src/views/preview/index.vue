<template>
  <template v-if="!isEmpty">
    <ListPage v-if="showList" :data="data" :show="true" :projectId="route.params.project" :pageId="route.params.id" />
    <HtmlPage v-if="showHtml" :code="data" />
    <PageView v-if="showPage" :data="data ? JSON.parse(data) : {}" />
  </template>
  <template v-else>
    <Result status="404" title="404"></Result>
  </template>
</template>

<script setup name="Preview">
import {  ConfigProvider } from "ant-design-vue";
import { getResource } from '@LowCode/api/basis'
import ListPage from '@LowCode/components/ListPage/Output/index.vue'
import HtmlPage from '@LowCode/components/CustomHTML/output/Preview.vue'
import PageView from '@LowCode/components/PageDesigner/preview.vue'
import { queryProject } from "@LowCode/api/project";
import { Result } from 'jetlinks-ui-components'

const route = useRoute()
const data = ref()
const isEmpty = ref(false)

const showList = computed(() => {
  return route.params?.type === 'list' && !!data.value
})

const showHtml = computed(() => {
  return route.params?.type === 'html' && !!data.value
})

const showPage = computed(() => {
  return route.params?.type === 'page' && !!data.value
})

const getInfo = async () => {
  data.value = undefined
  isEmpty.value = false
  const { project, module, id } = route.params
  queryProject({ terms: [{ value: project, termType: 'eq', column: 'id'}]}).then(resp => {
    if (resp.result && resp.result.data?.length && resp.result.data[0].runningState?.value === 'enabled') {
      isEmpty.value = false

      if (resp.result.data[0].others?.theme) {
        ConfigProvider.config({
          theme: {
            primaryColor: resp.result.data[0].others.theme || '#315efb'
          }
        })
      }
      getResource(project, module, id).then(resp => {
        data.value = typeof resp === 'string' ? resp : JSON.stringify(resp)
      })
    } else {
      isEmpty.value = true
    }
  })
}

if (route.name === 'preview') {
  getInfo()
}

</script>

<style scoped>

</style>
