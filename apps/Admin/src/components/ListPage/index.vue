<template>
  <div class="list-page">
    <Preview
      :show="showPreview"
      :id="props.data.id"
      @back="() => (showPreview = false)"
    />
    <DataBind
      ref="dataBindRef"
      v-model:open="visibles.GuideVisible"
      :id="props.data.id"
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
      v-model:columnsTree="buttonsConfig"
      :initData="allListData?.addButton"
      ref="btnTreeRef"
    />
    <OperationColumns
      v-model:open="visibles.OperationColumnsVisible"
      :initData="allListData?.actionsButton"
      v-model:columnsTree="actionsConfig"
      type="columns"
      ref="columnsRef"
    />
    <FilterModule
      v-model:open="visibles.FilterModuleVisible"
      v-model:dataSource="searchData"
      :id="props.data.id"
      ref="filterModuleRef"
    />
    <ListData
      v-model:open="visibles.ListDataVisible"
      :id="props.data.id"
      v-model:dataSource="dataSource"
      ref="listDataRef"
    />
    <ListForm
      v-model:open="visibles.ListFormVisible"
      :id="props.data.id"
      ref="listFormRef"
    />
    <PagingConfig
      v-model:open="visibles.PagingConfigVisible"
      v-model:pagingData="pagingData"
      :id="props.data.id"
      ref="pagingConfigRef"
    />
    <MenuConfig
      v-model:open="visibles.MenuConfigVisible"
      v-model:menuConfig="menuConfig"
      :data="props.data"
      ref="menuConfigRef"
    />
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
import { DATA_BIND, BASE_INFO, MENU_CONFIG } from './keys'
import { useProduct } from '@/store'
import { debounce, throttle } from 'lodash-es'

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

const buttonsConfig = ref<any[]>([])
const actionsConfig = ref<any[]>([])
const dataSource = ref<any[]>([])
const searchData = ref<any[]>([])
const pagingData = ref<any[]>([
  { pageSize: 12 },
  { pageSize: 24 },
  { pageSize: 48 },
  { pageSize: 96 },
])
const menuConfig = reactive({
  pageName: props.data.title,
  main: true,
  name: '',
  icon: '',
})

const listPageData = computed(() => {
  return {
    buttonsConfig: buttonsConfig.value,
    actionsConfig: actionsConfig.value,
    dataSource: dataSource.value,
    searchData: searchData.value,
    pagingData: pagingData.value,
    menu: menuConfig,
    dataBind,
  }
})
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
        console.log(res)
        resolve(res)
      })
      .catch((err) => {
        console.log(err)
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
    menuConfig: menuConfigRef.value?.errorList.length,
  }
})

const configDone = computed(() => {
  return {
    btn: buttonsConfig.value?.length,
    actions: actionsConfig.value?.length,
    filterModule: configurationStore.getALLlistDataInfo(props.data.id)
      ?.searchData?.length,
    listData: configurationStore.getALLlistDataInfo(props.data.id)?.datasource
      ?.length,
    pagination: configurationStore.getALLlistDataInfo(props.data.id)?.pagingData
      ?.length,
    ListForm: configurationStore.getALLlistDataInfo(props.data.id)?.showType,
  }
})

const dataBind = reactive({
  data: {
    function: undefined,
    command: undefined,
  },
  functionInfo: undefined,
})

provide(DATA_BIND, dataBind)
provide(BASE_INFO, props.data)
provide(MENU_CONFIG, menuConfig)
// watch(
//   () => buttonsConfig.value,
//   () => {
//     configurationStore.setALLlistDataInfo(
//       'addButton',
//       buttonsConfig.value,
//       props.data.id,
//     )
//   },
// )
// watch(
//   () => columnsRef?.value?.columnsTree,
//   () => {
//     configurationStore.setALLlistDataInfo(
//       'actionsButton',
//       columnsRef?.value?.columnsTree,
//       props.data.id,
//     )
//   },
// )

// watch(() => JSON.stringify(dataBind), () => {
//   configurationStore.setALLlistDataInfo('dataBind', dataBind, props.data.id)
// })

onMounted(() => {
  const editData = productStore.getById(props.data.id)?.configuration?.code
  visibles.GuideVisible = !editData
  const initData = JSON.parse(editData ? editData : '{}')
  Object.assign(dataBind, initData?.dataBind)
})

// watch(() => JSON.stringify(allListData.value), () => {
//   const record = {
//     ...props.data,
//     configuration: {
//       type: 'list',
//       code: JSON.stringify(configurationStore.getALLlistDataInfo(props.data.id))
//     },
//     others: {
//       ...props.data.others,
//       menu: {
//         ...configurationStore.getALLlistDataInfo(props.data.id)?.menu
//       },
//     }
//   }
//   productStore.update(record)
// })

const onSave = throttle((record) => {
  productStore.update(record)
}, 1000)
watch(
  () => JSON.stringify(listPageData.value),
  () => {
    const record = {
      ...props.data,
      configurationStore: {
        type: 'list',
        code: JSON.stringify(listPageData.value),
      },
      others: {
        ...props?.data?.others,
        menu: menuConfig.value
      },
    }
    onSave(record)
  },
)


</script>

<style scoped lang="less">
.list-page {
  height: 100%;
  position: relative;
}
</style>
