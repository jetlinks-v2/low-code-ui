<template>
  <div class="engine-tree" :style="{ flex: `0 0 ${collapsed ? 320 : 36 }px` }">
    <div class="engine-tree-content"  v-show="visible">
      <Search :collapsed="collapsed" @collapsed="collapsedChange" />
      <Tree
        :treeData="data"
      />
    </div>
    <div :class="productClass" @click="showTree">
      项目
    </div>
  </div>

</template>

<script setup name="EngineTree">
import Search from './search.vue'
import Tree from './tree.vue'
import { useProduct } from "@/store";
import { storeToRefs } from 'pinia'

const product = useProduct()

const { data } = storeToRefs(product)

const collapsed = ref(true)
const visible = ref(true)
const route = useRoute()

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

product.queryProduct(route.params.id)

</script>

<style scoped lang="less">
.engine-tree {
  //background-color: @layout-left;
  min-width: 0;
  transition: all .15s;
  overflow-x: hidden;
  user-select: none;
  border-right: 1px solid #d7d7d7;

  .engine-tree-content {
    display: flex;
    flex-direction: column;
    height: 100%;
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
