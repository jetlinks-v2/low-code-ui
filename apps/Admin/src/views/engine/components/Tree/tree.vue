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
                <j-menu
                  mode="vertical"
                  @click="({ key: menuKey }) => onContextMenuClick(node, menuKey)"
                >
                  <j-sub-menu key="Add" title="新建" style="width: 160px">
                    <j-menu-item key="Module">模块</j-menu-item>
                    <j-menu-item key="Resource">资源</j-menu-item>

                    <j-sub-menu key="Page" title="页面" style="width: 160px">
                      <j-menu-item style="width: 160px" key="HtmlPage">自定义html</j-menu-item>
                      <j-menu-item style="width: 160px" key="ListPage">列表页模版</j-menu-item>
                      <j-menu-item style="width: 160px" key="FormPage">表单页模版</j-menu-item>
                    </j-sub-menu>

                    <j-menu-item key="CRUD">增删改查</j-menu-item>
                    <j-menu-item key="SQL">SQL</j-menu-item>
                    <j-menu-item key="Function">函数</j-menu-item>
                  </j-sub-menu>
                  <j-menu-item v-if="node.type !== 'project'" key="Copy">复制</j-menu-item>
                  <j-menu-item v-if="node.type !== 'project'" key="Paste">粘贴</j-menu-item>
                  <j-menu-item v-if="node.type !== 'project'" key="Cut">剪切</j-menu-item>
                  <j-menu-item v-if="node.type !== 'project'" key="Rename">重命名</j-menu-item>
                  <j-menu-item v-if="node.type !== 'project'" key="Delete">删除</j-menu-item>
                  <j-menu-item key="Profile">显示简介</j-menu-item>
                </j-menu>
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

const engine = useEngine()
const { activeFile, expandedKeys } = storeToRefs(engine)

const props = defineProps({
  treeData: {
    type: Array,
    default: () => []
  }
})

const select = (key, e) => {
  if (e.node?.type !== 'project') {
    engine.addFile({
      id: e.node.key,
      title: e.node.title,
      type: e.node.type
    })
  }
}

const onContextMenuClick = (node, menuKey) => {
  console.log(node, menuKey)
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
