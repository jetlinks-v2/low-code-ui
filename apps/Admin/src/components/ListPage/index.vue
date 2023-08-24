<template>
  <div class="list-page">
    <DataBind
      ref="dataBindRef"
      v-model:open="visibles.GuideVisible"
      @valid="handleValid"
      @modify="handleDataBindChange"
    />
    <ListSkeleton
      :visibles="visibles"
      @visibles="handleVisible"
      @goPreview="goPreview"
      :dataBindRef="dataBindRef"
      :menuRef="menuRef"
      :errorCount="errorCount"
      :configDone="configDone"
    />
    <OperationColumns
      v-model:open="visibles.OperationBtnsVisible"
      type="btns"
      ref="btnTreeRef"
    />
    <OperationColumns
      v-model:open="visibles.OperationColumnsVisible"
      type="columns"
      ref="columnsRef"
    />
    <FilterModule
      v-model:open="visibles.FilterModuleVisible"
      :id="props.data.id"
      ref="filterModuleRef"
    />
    <ListData v-model:open="visibles.ListDataVisible" :id="props.data.id" />
    <ListForm v-model:open="visibles.ListFormVisible" :id="props.data.id" ref="listFormRef"/>
    <PagingConfig
      v-model:open="visibles.PagingConfigVisible"
      :id="props.data.id"
      ref="pagingConfigRef"
    />
    <MenuConfig v-model:open="visibles.MenuConfigVisible" :id="props.data.id" />
  </div>
</template>

<script setup lang="ts" name="ListPage">
import DataBind from './DataBind/index.vue'
import FilterModule from './FilterModule/index.vue'
import ListData from './ListData/index.vue'
import ListForm from './ListForm/index.vue'
import PagingConfig from './PagingConfig/index.vue'
import MenuConfig from './MenuConfig/index.vue'
import ListSkeleton from './ListSkeleton/index.vue'
import OperationColumns from './Operation/index.vue'
import { router } from '@jetlinks/router'
import { useAllListDataStore } from '@/store/listForm'
import { omit } from 'lodash-es'
import { functionsKey, pagesKey } from './keys'
import { useProduct } from '@/store'

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
})
const configurationStore = useAllListDataStore()
const productStore = useProduct()

const dataBindRef = ref()
const menuRef = ref()

const visibles = reactive({
  GuideVisible: false,
  OperationBtnsVisible: false,
  OperationColumnsVisible: false,
  FilterModuleVisible: false,
  ListDataVisible: false,
  ListFormVisible: false,
  PagingConfigVisible: false,
  MenuConfigVisible: false,
})

const handleVisible = (key: string, value: boolean) => {
  visibles[key] = value
}
const goPreview = () => {
  router.push(`/preview/${props.data.id}`)
  console.log(props.data, 'props.data')
}
/**
 * 数据绑定变更
 */
const handleDataBindChange = () => {
  dataBind.data.function = undefined
  dataBind.data.command = undefined
  dataBind.functionInfo = undefined
}

/**
 * 校验
 */
const btnTreeRef = ref()
const columnsRef = ref()
const filterModuleRef = ref()
const pagingConfigRef = ref()
const listFormRef = ref()
const handleValid = async () => {
  const res = await btnTreeRef.value?.valid()
  columnsRef.value?.valid()
  // filterModuleRef.value?.valid()
  pagingConfigRef.value?.valid()
  listFormRef.value?.valid()
}

const errorCount = computed(() => {
  return {
    btn: btnTreeRef.value?.errorList.length,
    actions: columnsRef.value?.errorList.length,
    pagination: pagingConfigRef.value?.errorList.length,
    listForm: listFormRef.value?.errorList.length
  }
})

const configDone = computed(() => {
  return {
    btn: btnTreeRef.value?.columnsTree.length,
    actions: columnsRef.value?.columnsTree.length,
  }
})

/**
 * 获取草稿下的所有功能和页面
 */
const functions = ref<Draft.Function[]>([])
const pages = ref<Partial<Draft.Module>[]>([])
/**
 * 获取草稿下的所有功能和页面
 */
const findFunctionsPages = (data: any[]) => {
  data.forEach((item) => {
    if (item.functions && item.functions.length) {
      functions.value.push(...item.functions)
    }
    if (item.type == 'page-code') {
      pages.value.push(omit(item, 'children'))
    }
    if (item.children) {
      findFunctionsPages(item.children)
    }
  })
}
findFunctionsPages(productStore.data)

const dataBind = reactive({
  data: {
    function: undefined,
    command: undefined,
  },
  functionInfo: undefined,
})
provide('dataBind', dataBind)
provide(functionsKey, functions)
provide(pagesKey, pages)
watch(
  () => btnTreeRef?.value?.columnsTree,
  () => {
    configurationStore.setALLlistDataInfo(
      'addButton',
      btnTreeRef?.value?.columnsTree,
      props.data.id,
    )
  },
)
watch(
  () => columnsRef?.value?.columnsTree,
  () => {
    configurationStore.setALLlistDataInfo(
      'actionsButton',
      columnsRef?.value?.columnsTree,
      props.data.id,
    )
  },
)
</script>

<style scoped lang="less">
.list-page {
  height: 100%;
}
</style>
