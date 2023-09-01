<template>
  <ListPage v-if="showList" :data="data" :show="true" />
  <HtmlPage v-else-if="showHtml" :code="data" />
</template>

<script setup name="Preview">
import { getResource } from '@/api/basis'
import { useRequest } from '@jetlinks/hooks'
import ListPage from '@/components/ListPage/Preview/index.vue'
import HtmlPage from '@/components/CustomHTML/output/Preview.vue'

const route = useRoute()

const { data, loading, run } = useRequest(getResource, { immediate: false })

const showList = computed(() => {
  return route.params.type === 'list'
})

const showHtml = computed(() => {
  return route.params.type === 'html'
})

const getInfo = async () => {
  const { project, module, id } = route.params
  run(project, module, id)
}

watch(() => {
  if (route.name === 'Preview') {
    getInfo()
  }
})

</script>

<style scoped>

</style>
