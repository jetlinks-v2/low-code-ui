<template>
  <div class="engine-tree" :style="{ flex: `0 0 ${collapsed ? width : 34}px` }">
    <drag-box v-show="visible" position="right" :max="360" @move="move">
      <div style="overflow: hidden; height: 100%">
        <div class="engine-tree-content">
          <Search :collapsed="collapsed" @collapsed="collapsedChange" />
          <Tree
            :treeData="data"
          />
        </div>
      </div>

    </drag-box>

    <div v-show="!collapsed" :class="productClass" @click="showTree">
      项目
    </div>
  </div>

</template>

<script setup name="EngineTree">
import Search from './search.vue'
import Tree from './tree.vue'
import { useProduct ,useEngine} from "@LowCode/store";
import { storeToRefs } from 'pinia'
import { DragBox } from '@LowCode/components/index'
import { isString } from 'lodash-es';

const product = useProduct()
const engine = useEngine()

const { data } = storeToRefs(product)

const collapsed = ref(true)
const visible = ref(true)
const route = useRoute()
const width = ref(320)

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

const move = (v) => {
  width.value = v + 1
}

const productClass = computed(() => {
  return {
    'product': true,
    'show': !visible.value
  }
})

watch(() => route.params.id, () => {
  if (route.params.id !== undefined ) {
    product.initProjectState()
    product.queryProduct(route.params.id,()=>{
      const data = product.data[0]

      const files = data?.others?.files?.map(item=>{
        if(isString(item)){
          return product.getById(item)
        }
        return item
      })?.filter(item => item)

      if(files && files.length!==0){
        if (data?.state?.value !== 'published') {
        engine.selectFiles(files)
        engine.setActiveFile(data?.others?.activeFile || data?.id)
        engine.selectFile(data?.others?.activeFile)
        } else {
          engine.setActiveFile(data?.id)
          engine.selectFile(data.id)
        }
      }
    })
  }
}, { immediate: true })

</script>

<style scoped lang="less">
.engine-tree {
  //background-color: @layout-left;
  min-width: 0;
  user-select: none;
  border-right: 1px solid #d1d1d1;
  height: 100%;

  .engine-tree-content {
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
