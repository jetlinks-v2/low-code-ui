<template>
  <div class="tree-warp">
    <Menu :projectData="list" @change="change" />
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
  list.value = [...maps.values()].filter(item => item.others && item.others?.menu)
}

const change = (data) => {
  emit('change', data)
}

getTree()
getAllTree()

</script>

<style scoped>

</style>
