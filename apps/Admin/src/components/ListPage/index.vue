<template>
  <div class="list-page">
    <Preview :show="showPreview" :id="props.data.id" @back="() => (showPreview = false)"/>
    <DataBind
      ref="dataBindRef"
      v-model:open="visibles.GuideVisible"
      @valid="validate"
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
      :initData="allListData?.addButton"
      ref="btnTreeRef"
    />
    <OperationColumns
      v-model:open="visibles.OperationColumnsVisible"
      :initData="allListData?.actionsButton"
      type="columns"
      ref="columnsRef"
    />
    <FilterModule
      v-model:open="visibles.FilterModuleVisible"
      :id="props.data.id"
      ref="filterModuleRef"
    />
    <ListData
      v-model:open="visibles.ListDataVisible"
      :id="props.data.id"
      ref="listDataRef"
    />
    <ListForm
      v-model:open="visibles.ListFormVisible"
      :id="props.data.id"
      ref="listFormRef"
    />
    <PagingConfig
      v-model:open="visibles.PagingConfigVisible"
      :id="props.data.id"
      ref="pagingConfigRef"
    />
    <MenuConfig v-model:open="visibles.MenuConfigVisible" :id="props.data.id" ref="menuConfigRef"/>
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
import Preview from './Preview/index.vue'
import { useAllListDataStore } from '@/store/listForm'
import { omit } from 'lodash-es'
import { DATA_BIND, BASE_INFO } from './keys'
import { useProduct } from '@/store'

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
})
const configurationStore = useAllListDataStore()
const productStore = useProduct()

const showPreview = ref(false)
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

const allListData = computed(() => {
  return configurationStore.getALLlistDataInfo(props.data.id)
})


const handleVisible = (key: string, value: boolean) => {
  visibles[key] = value
}
const goPreview = () => {
  showPreview.value = true
}

/**
 * 校验
 */
const dataBindRef = ref()
const btnTreeRef = ref()
const columnsRef = ref()
const filterModuleRef = ref()
const pagingConfigRef = ref()
const listFormRef = ref()
const listDataRef = ref()
const menuConfigRef = ref()
const validate = async () => {
  const promiseArr = [
    btnTreeRef.value?.valid(),
    columnsRef.value?.valid(),
    filterModuleRef.value?.valid(),
    pagingConfigRef.value?.valid(),
    listFormRef.value?.valid(),
    listDataRef.value?.valid(),
    menuConfigRef.value?.valid(),
    dataBindRef.value?.valid(),
  ]
  return new Promise((resolve) => {
    Promise.all(promiseArr)
    .then((res) => {
      console.log(res);
      resolve(res)
    })
    .catch((err) => {
      console.log(err);
      throw err
    })
  })
}

const errorCount = computed(() => {
  return {
    btn: btnTreeRef.value?.errorList.length,
    actions: columnsRef.value?.errorList.length,
    pagination: pagingConfigRef.value?.errorList.length,
    listForm: listFormRef.value?.errorList.length,
    filterModule: filterModuleRef.value?.errorList.length,
    listData: listDataRef.value?.errorList.length,
    menuConfig: menuConfigRef.value?.errorList.length
  }
})

const configDone = computed(() => {
  return {
    btn: btnTreeRef.value?.columnsTree.length,
    actions: columnsRef.value?.columnsTree.length,
    filterModule: configurationStore.getALLlistDataInfo(props.data.id)?.searchData?.length,
    listData: configurationStore.getALLlistDataInfo(props.data.id)?.datasource?.length,
    pagination: configurationStore.getALLlistDataInfo(props.data.id)?.pagingData?.length,
    ListForm: configurationStore.getALLlistDataInfo(props.data.id)?.showType,
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

const filterModule = ref<any[]>([])
const listData = ref<any[]>([])
provide(DATA_BIND, dataBind)
provide(BASE_INFO, props.data)
provide('FILTER_MODULE', filterModule)
provide('LIST_DATA', listData)
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

const showGuide = computed(() => {
  return !props.data.configuration?.code
})

watchEffect(() => {
  if(showGuide.value) {
    visibles.GuideVisible = true
  }
})
</script>

<style scoped lang="less">
.list-page {
  height: 100%;
  position: relative;
}
</style>
