<template>
  <div class="tree-warp">
    <Menu :projectData="list" @change="change" :projectId="product.info.id" />
  </div>
</template>

<script setup name="projectTree">
import { useProduct } from '@LowCode/store'

const emit = defineEmits(['change'])
const product = useProduct()

const list = ref([])

const getTree = () => {
  const maps = product.getDataMap()
  const copyData = JSON.parse(JSON.stringify([...maps.values()]))

  list.value = copyData.filter(item => {
    return item.others && item.others?.menu && item.others?.menu.main
  }).map(item => {
    item.parentFullId = maps.get(item.parentId).fullId || item.parentId
    return item
  })
}

const change = (data) => {
  emit('change', data)
}

defineExpose({
  init: () => {
    getTree()
  }
})

</script>

<style scoped>

</style>
