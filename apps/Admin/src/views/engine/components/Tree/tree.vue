<template>
  <div class="tree-content-warp">
    <div class="tree-content-body">
      <j-scrollbar>
        <j-tree
          v-model:expandedKeys="expandedKeys"
          :selectedKeys="[activeFile]"
          :treeData="treeData"
          :fieldNames="{
            key: 'id'
          }"
          @select="select"
        >
          <template #title="node">
            <j-dropdown :trigger="['contextmenu']">
              <span>{{ node.title }}</span>
              <template #overlay>
                <RightMenu :node="node" @click="menuClick" />
              </template>
            </j-dropdown>
          </template>
        </j-tree>
      </j-scrollbar>
    </div>
    <InputModal
      v-if="menuState.visible"
      v-bind="menuState"
      @save="save"
      @close="close"
    />
  </div>
</template>

<script setup name="EngineTreeContent">
import { useEngine, useProduct } from '@/store'
import { storeToRefs } from 'pinia'
import RightMenu from './rightMenu.vue'
import InputModal from '@/components/ProJect/components/Action/InputModal.vue'
import {providerEnum} from "@/components/ProJect/index";
import { randomString } from '@jetlinks/utils'

const engine = useEngine()
const product = useProduct()

const { activeFile, expandedKeys } = storeToRefs(engine)

const props = defineProps({
  treeData: {
    type: Array,
    default: () => []
  }
})

const menuState = reactive({
  visible: false,
  provider: '',
  cacheData: undefined,
  data: undefined,
  type: undefined,
  nameList: []
})

const select = (key, e) => {
  engine.addFile({
    id: e.node.id,
    title: e.node.title,
    type: e.node.type,
    children: e.node.children
  })
}

const close = () => {
  menuState.visible = false
  menuState.provider = ''
  menuState.data = undefined
  menuState.cacheData = undefined
  menuState.type = undefined
  menuState.nameList = []
}

const save = ({ name }) => {
  const node = menuState.cacheData
  const parentId = node.type === providerEnum.Module ? node.id : node.parentId
  product.add({
    name,
    id: randomString(16),
    title: name,
    type: menuState.provider,
    parentId: parentId
  }, parentId)
  close()
}

const menuClick = (record) => {
  Object.assign(menuState, record)
  menuState.visible = true
}

</script>

<style scoped lang="less">
.tree-content-warp {
  flex: 0 0 auto;
  min-height: 0;

  .tree-content-body {
    height: 100%;
  }
  //:deep(.ant-tree) {
  //  background-color: transparent;
  //  color: #f8f8f8;
  //
  //  .ant-tree-switcher {
  //    background-color: transparent;
  //    color: #f8f8f8;
  //  }
  //}
}
</style>
