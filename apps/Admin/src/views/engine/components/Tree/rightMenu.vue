<template>
  <j-menu mode="vertical" :value="''" v-if="node.type !== 'project'"
    @click="({ key: menuKey }) => onContextMenuClick(node, menuKey)">
    <j-sub-menu :key="actionMap['Add'].key" :title="actionMap['Add'].value" style="width: 160px">
      <j-menu-item :key="providerEnum.Module">
        <template #icon>
          <img :src="getImage('/project/module.svg')" style="width: 24px; height: 24px;">
        </template>
        {{ providerMap[providerEnum.Module] }}
      </j-menu-item>
      <j-menu-item :key="providerEnum.HtmlPage">
        <template #icon>
          <img :src="getImage('/project/html.svg')" style="width: 24px; height: 24px;">
        </template>
        {{ providerMap[providerEnum.HtmlPage] }}
      </j-menu-item>
      <j-menu-item :key="providerEnum.ListPage">
        <template #icon>
          <img :src="getImage('/project/list.svg')" style="width: 24px; height: 24px;">
        </template>
        {{ providerMap[providerEnum.ListPage] }}
      </j-menu-item>
      <j-menu-item :key="providerEnum.FormPage">
        <template #icon>
          <img :src="getImage('/project/form.svg')" style="width: 24px; height: 24px;">
        </template>
        {{ providerMap[providerEnum.FormPage] }}
      </j-menu-item>
      <j-menu-item :key="providerEnum.CRUD">
        <template #icon>
          <img :src="getImage('/project/curd.svg')" style="width: 24px; height: 24px;">
        </template>
        {{ providerMap[providerEnum.CRUD] }}
      </j-menu-item>
      <j-menu-item :key="providerEnum.SQL">
        <template #icon>
          <img :src="getImage('/project/sql.svg')" style="width: 24px; height: 24px;">
        </template>
        {{ providerMap[providerEnum.SQL] }}
      </j-menu-item>
      <j-menu-item :key="providerEnum.Function">
        <template #icon>
          <img :src="getImage('/project/function.svg')" style="width: 24px; height: 24px;">
        </template>
        {{ providerMap[providerEnum.Function] }}
      </j-menu-item>
    </j-sub-menu>
    <j-menu-item :key="actionMap['Profile'].key">{{ actionMap['Profile'].value }}</j-menu-item>
    <j-menu-item :key="actionMap['Copy'].key">{{ actionMap['Copy'].value }}</j-menu-item>
    <j-menu-item :key="actionMap['Paste'].key" :disabled="!copyFile">{{ actionMap['Paste'].value }}</j-menu-item>
    <j-menu-item :key="actionMap['Rename'].key">{{ actionMap['Rename'].value }}</j-menu-item>
    <j-menu-item :key="actionMap['Delete'].key">{{ actionMap['Delete'].value }}</j-menu-item>
  </j-menu>
</template>

<script setup name="RightClickMenu">
import { useProduct, useEngine } from "@/store";

import { providerMap, providerEnum, actionMap, restId } from '@/components/ProJect/index'
import { storeToRefs } from 'pinia'
import { getImage } from '@jetlinks/utils';

const product = useProduct()
const engine = useEngine()

const props = defineProps({
  node: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['click'])

const { copyFile } = storeToRefs(engine)

const onPaste = (node) => {
  const copyItem = product.getById(engine.copyFile)
  const isModule = node.type === providerEnum.Module
  let _arr = node.data.children || []
  if (!isModule) {
    _arr = product.getById(node.parentId)?.children || []
  }
  const copyData = {
    data: {
      title: `copy_${copyItem.name}`,
      children: copyItem.children ? restId(copyItem.children) : undefined,
      parentId: isModule ? node.id : node.parentId
    },
    provider: copyItem.type,
    type: 'Add',
    nameList: _arr.map(item => item.name),
    cacheData: node.data
  }
  emit('click', copyData)
}

const onContextMenuClick = (node, menuKey) => {

  switch (menuKey) {
    case providerEnum.Module:
    case providerEnum.HtmlPage:
    case providerEnum.ListPage:
    case providerEnum.FormPage:
    case providerEnum.CRUD:
    case providerEnum.SQL:
    case providerEnum.Function:
      const isModule = node.type === providerEnum.Module
      let _arr = node.data.children || []
      if (!isModule) {
        _arr = product.getById(node.parentId)?.children || []
      }
      emit('click', {
        data: undefined,
        cacheData: node.data,
        provider: menuKey,
        nameList: _arr.map(item => item.name),
        type: 'Add'
      })
      break;
    case actionMap.Rename.key:
      emit('click', {
        data: node.data,
        cacheData: node.data,
        provider: node.data.type,
        nameList: (product.getById(node.parentId)?.children || []).map(item => item.name),
        type: 'Rename'
      })
      break;
    case actionMap.Profile.key:
      emit('click', {
        data: node.data,
        cacheData: node.data,
        menuKey: 'Profile',
      })
      break;
    case actionMap.Delete.key:
      // product.remove(node)
      emit('click', {
        data: node.data,
        cacheData: node.data,
        menuKey: 'Delete',
      })
      break;
    case actionMap.Copy.key:
      emit('click', {
        data: node.data,
        menuKey: menuKey
      })
      break;
    case actionMap.Paste.key:
      // console.log('-------',node)
      onPaste(node)
      break;
  }

}
</script>

<style scoped></style>
