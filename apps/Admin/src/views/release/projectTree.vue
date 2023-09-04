<template>
  <div class="tree-warp">
    <Menu :projectData="list" @change="change" :projectId="product.info.id" />
  </div>
</template>

<script setup name="projectTree">
import { useProduct } from '@/store'

const emit = defineEmits(['change'])
const product = useProduct()

const list = ref([])

const getAllTree = () => {

}

const getTree = () => {
  const maps = product.getDataMap()
  const copyData = JSON.parse(JSON.stringify([...maps.values()]))
  list.value = copyData.filter(item => item.others && item.others?.menu).map(item => {
    item.parentFullId = maps.get(item.parentId).fullId
    return item
  })
}

const change = (data) => {
  emit('change', data)
}

getTree()
getAllTree()

</script>

<style scoped>

</style>
