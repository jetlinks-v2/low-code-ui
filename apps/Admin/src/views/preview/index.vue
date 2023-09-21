<template>
  <template v-if="!isEmpty">
    <ListPage v-if="showList" :data="data" :show="true" :projectId="route.params.project" />
    <HtmlPage v-else-if="showHtml" :code="data" />
  </template>
  <template>

  </template>
</template>

<script setup name="Preview">
import { getResource } from '@/api/basis'
import ListPage from '@/components/ListPage/Output/index.vue'
import HtmlPage from '@/components/CustomHTML/output/Preview.vue'

const route = useRoute()
const data = ref()
const isEmpty = ref(false)


const showList = computed(() => {
  return route.params?.type === 'list' && data.value
})

const showHtml = computed(() => {
  return route.params?.type === 'html' && data.value
})

const getInfo = async () => {
  const { project, module, id } = route.params
  getResource(project, module, id).then(resp => {
    data.value = typeof resp === 'string' ? resp : JSON.stringify(resp)
  })
}

watch(() => {
  if (route.name === 'Preview') {
    getInfo()
  }
})

</script>

<style scoped>

</style>
