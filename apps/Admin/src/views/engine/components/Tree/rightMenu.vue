<template>
  <j-menu
    mode="vertical"
    v-if="node.type !== 'project'"
    @click="({ key: menuKey }) => onContextMenuClick(node, menuKey)"
  >
    <j-sub-menu :key="actionMap['Add'].key" :title="actionMap['Add'].value" style="width: 160px">
      <j-menu-item :key="providerEnum.Module">{{ providerMap[providerEnum.Module] }}</j-menu-item>

      <j-sub-menu :key="providerEnum.Page" :title="providerMap[providerEnum.Page]" style="width: 160px">
          <j-menu-item  style="width: 160px" :key="providerEnum.HtmlPage">{{ providerMap[providerEnum.HtmlPage] }}</j-menu-item>
          <j-menu-item  style="width: 160px" :key="providerEnum.ListPage">{{ providerMap[providerEnum.ListPage] }}</j-menu-item>
          <j-menu-item  style="width: 160px" :key="providerEnum.FormPage">{{ providerMap[providerEnum.FormPage] }}</j-menu-item>
       </j-sub-menu>

       <j-menu-item :key="providerEnum.CRUD">{{ providerMap[providerEnum.CRUD] }}</j-menu-item>
        <j-menu-item :key="providerEnum.SQL">{{ providerMap[providerEnum.SQL] }}</j-menu-item>
         <j-menu-item :key="providerEnum.Function">{{ providerMap[providerEnum.Function] }}</j-menu-item>
    </j-sub-menu>
    <!-- <j-menu-item key="Copy">复制</j-menu-item>
    <j-menu-item key="Paste">粘贴</j-menu-item>
    <j-menu-item key="Rename">重命名</j-menu-item>
    <j-menu-item key="Delete">删除</j-menu-item>
    <j-menu-item key="Profile">显示简介</j-menu-item> -->
    <j-menu-item :key="actionMap['Profile'].key">{{actionMap['Profile'].value}}</j-menu-item>
    <j-menu-item :key="actionMap['Copy'].key">{{actionMap['Copy'].value  }}</j-menu-item>
    <j-menu-item :key="actionMap['Paste'].key" :disabled="!!copyFile">{{actionMap['Paste'].value  }}</j-menu-item>
    <j-menu-item :key="actionMap['Rename'].key">{{actionMap['Rename'].value  }}</j-menu-item>
    <j-menu-item :key="actionMap['Delete'].key">{{actionMap['Delete'].value  }}</j-menu-item>
  </j-menu>
</template>

<script setup name="RightClickMenu">
import { useProduct, useEngine } from "@/store";
import { randomString } from '@jetlinks/utils'
import {providerMap, providerEnum,actionMap} from  '@/components/ProJect/index'
import { storeToRefs } from 'pinia'

const product = useProduct()
const engine = useEngine()

const props = defineProps({
  node: {
    type: Object,
    default: () => ({})
  }
})

const {copyFile} = storeToRefs(engine)

const onContextMenuClick = (node, menuKey) => {
  console.log(node, menuKey)
  switch(menuKey) {
    case providerEnum.Module:
      product.add({
        id: randomString(16),
        title: '测试新增_'+menuKey,
        type: menuKey,
        selectable: false,
        parentId: node.parentId
      }, node.parentId)
      break
    case providerEnum.HtmlPage:
    case providerEnum.ListPage:
    case providerEnum.FormPage:
    case providerEnum.CRUD:
    case providerEnum.SQL:
    case providerEnum.Function:
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
