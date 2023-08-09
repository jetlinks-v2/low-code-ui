<template>

  <div class="engine-tree" :style="{ flex: `0 0 ${collapsed ? 320 : 36 }px` }">
    <div class="engine-tree-content"  v-show="visible">
      <Search :collapsed="collapsed" @collapsed="collapsedChange" />

    </div>
    <div :class="productClass" @click="showTree">
      项目
    </div>
  </div>

</template>

<script setup name="EngineTree">
import Search from './search.vue'
import { useProduct } from '@/store'

const collapsed = ref(true)
const visible = ref(true)
const product = useProduct()

const collapsedChange = (e) => {
  collapsed.value = e
  if (e === false) {
    setTimeout(() => {
      visible.value = false
    }, 50)
  }
}

const showTree = () => {
  collapsed.value = true
  visible.value = true
}

const productClass = computed(() => {
  return {
    'product': true,
    'show': !visible.value
  }
})

</script>

<style scoped lang="less">
.engine-tree {
  background-color: @layout-left;
  min-width: 0;
  transition: all .15s;
  overflow-x: hidden;
  user-select: none;

  .engine-tree-content {

  }

  .product {
    display: none;
    color: #f8f8f8;
    padding: 12px 6px;
    background-color: #323844;
    cursor: pointer;
    writing-mode: vertical-lr;

    &.show {
      display: block;
    }
  }
}


</style>
