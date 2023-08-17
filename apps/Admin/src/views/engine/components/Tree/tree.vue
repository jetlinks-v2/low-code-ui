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
                <RightMenu :node="node" />
              </template>
            </j-dropdown>
          </template>
        </j-tree>
      </j-scrollbar>
    </div>

  </div>
</template>

<script setup name="EngineTreeContent">
import { useEngine } from '@/store'
import { storeToRefs } from 'pinia'
import RightMenu from './rightMenu.vue'

const engine = useEngine()

const { activeFile, expandedKeys } = storeToRefs(engine)

const props = defineProps({
  treeData: {
    type: Array,
    default: () => []
  }
})

const select = (key, e) => {
  console.log(e)
  if (e.node?.type !== 'project') {
    engine.addFile({
      id: e.node.id,
      title: e.node.title,
      type: e.node.type,
      children: e.node.children
    })
  }
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
