<template>
  <div class="tree-warp">
    <Menu :projectData="list" @change="change" :projectId="product.info.id" />
  </div>
</template>

<script setup name="projectTree">
import { useProduct } from '@LowCode/store'
import { Menu } from '@LowCode/components/index'
import { getMenus } from '@LowCode/utils/project'

const emit = defineEmits(['change'])
const product = useProduct()

const list = ref([])

const getTree = () => {
  const maps = product.getDataMap()

  list.value = getMenus(maps)
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
