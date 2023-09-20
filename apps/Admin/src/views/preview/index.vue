<template>
  <ListPage v-if="showList" :data="data" :show="true" />
  <HtmlPage v-else-if="showHtml" :code="data" />
</template>

<script setup name="Preview">
import { getResource } from '@/api/basis'
import ListPage from '@/components/ListPage/Output/index.vue'
import HtmlPage from '@/components/CustomHTML/output/Preview.vue'

const route = useRoute()
const data = ref()

const showList = computed(() => {
  return route.params.type === 'list' && data.value
})

const showHtml = computed(() => {
  return route.params.type === 'html' && data.value
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
