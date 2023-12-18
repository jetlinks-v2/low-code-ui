<template>
  <template v-if="!isEmpty">
  <page-container>
    <ListPage v-if="showList" :data="data" :show="true" :projectId="routeParams.project" :pageId="routeParams.id" />
    <HtmlPage v-if="showHtml" :code="data" />
    <PageView v-if="showPage" :key="routeParams.id + '_' + routeParams.sid" :data="data ? JSON.parse(data) : {}" />
  </page-container>
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
import { useRoute } from '@jetlinks-web/router'

const route = useRoute()
const data = ref()
const isEmpty = ref(false)

const routeParams = reactive({
  project: undefined,
  id: undefined,
  sid: undefined,
  type: undefined,
  module: undefined
})

const showList = computed(() => {
  return routeParams.type === 'list' && !!data.value
})

const showHtml = computed(() => {
  return routeParams.type === 'html' && !!data.value
})

const showPage = computed(() => {
  return routeParams.type === 'page' && !!data.value
})

const handleParams = (path) => {
  const [ name, project, module, id, type, sid ] = path.substring(1).split('/')

  routeParams.id = id
  routeParams.module = module
  routeParams.type = type
  routeParams.project = project
  routeParams.sid = sid

  return {
    project, module, id, type, sid, name
  }
}

const getInfo = async () => {
  data.value = undefined
  isEmpty.value = false
  const { project, module, id } = handleParams(route.path)

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

watch(() => route.path, () => {
  const { name } = handleParams(route.path)
  if (name === 'preview') {
    getInfo()
  }
}, { immediate: true })

</script>

<style scoped>

</style>
