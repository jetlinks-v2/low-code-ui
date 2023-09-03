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
import { providerEnum } from "@/components/ProJect/index";
import { randomString } from '@jetlinks/utils'
import { defaultSetting as CrudBaseData } from '@/components/Database/setting'

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
    ...e.node.dataRef
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

const getConfiguration = (type) => {
  switch (type) {
    case providerEnum.SQL:
      return {
        sql: undefined
      };
    case providerEnum.CRUD:
      return {
        columns: CrudBaseData
      };
    case providerEnum.Function:
      return {
        lang: undefined,
        script: ''
      };
    case providerEnum.FormPage:
      return {
        type: 'form',
        code: ''
      };
    case providerEnum.ListPage:
      return {
        type: 'list',
        code: ''
      };
    case providerEnum.HtmlPage:
      return {
        type: 'html',
        code: ''
      };
  }
}

const save = ({ name, others }) => {
  const node = menuState.cacheData

  const parentId = node.type === providerEnum.Module ? node.id : node.parentId
  product.add({
    name,
    others,
    id: randomString(16),
    title: name,
    type: others.type,
    configuration: getConfiguration(others.type),
    parentId: parentId,
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
  height: calc(100% - 44px);

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
