<template>
  <j-menu
    mode="vertical"
    v-if="node.type !== 'project'"
    @click="({ key: menuKey }) => onContextMenuClick(node, menuKey)"
  >
    <j-sub-menu key="Add" title="新建" style="width: 160px">
      <j-menu-item key="module">模块</j-menu-item>
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
    <j-menu-item key="Copy">复制</j-menu-item>
    <j-menu-item key="Paste">粘贴</j-menu-item>
    <j-menu-item key="Cut">剪切</j-menu-item>
    <j-menu-item key="Rename">重命名</j-menu-item>
    <j-menu-item key="Delete">删除</j-menu-item>
    <j-menu-item key="Profile">显示简介</j-menu-item>
  </j-menu>
</template>

<script setup name="RightClickMenu">
import {useProduct} from "@/store";
import { randomString } from '@jetlinks/utils'

const product = useProduct()

const props = defineProps({
  node: {
    type: Object,
    default: () => ({})
  }
})
const onContextMenuClick = (node, menuKey) => {
  console.log(node, menuKey)
  switch(menuKey) {
    case 'module':
      product.add({
        id: randomString(16),
        title: '测试新增_'+menuKey,
        type: menuKey,
        selectable: false,
        parentId: node.parentId
      }, node.parentId)
      break
    case 'Resource':
    case 'HtmlPage':
    case 'ListPage':
    case 'FormPage':
    case 'CRUD':
    case 'SQL':
    case 'Function':
      product.add({
        id: randomString(16),
        title: '测试新增_'+menuKey,
        type: menuKey
      }, node.id)
      break;
  }

}
</script>

<style scoped>

</style>
