<template>
  <div class="list-page">
    <Preview
      :show="showPreview"
      :pageId="props.data.id"
      :projectId="info.id"
      :data="props.data?.configuration?.code"
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
      ref="btnTreeRef"
    />
    <OperationColumns
      v-model:open="visibles.OperationColumnsVisible"
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
      v-model:listFormInfo="listFormInfo"
      v-model:state="showType"
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
    <CheckSpin :spinning="spinning" />
  </div>
</template>

<script setup lang="ts" name="ListPage">
import './style.less'
import DataBind from './DataBind/index.vue'
import FilterModule from './FilterModule/index.vue'
import ListData from './ListData/index.vue'
import ListForm from './ListForm/index.vue'
import PagingConfig from './PagingConfig/index.vue'
import MenuConfig from './MenuConfig/index.vue'
import ListSkeleton from './ListSkeleton/index.vue'
import OperationColumns from './Operation/index.vue'
import Preview from './Preview/index.vue'
import {
  DATA_BIND,
  BASE_INFO,
  MENU_CONFIG,
  SHOW_TYPE_KEY,
  LIST_PAGE_DATA_KEY,
  LIST_FORM_INFO,
  DATA_SOURCE,
  showColumnsKey,
  ACTION_CONFIG_KEY,
  SEARCH_DATA,
} from './keys'
import { useProduct } from '@LowCode/store'
import { isEmpty, omit, throttle } from 'lodash-es'
import { onlyMessage } from '@jetlinks-web/utils'
import { storeToRefs } from 'pinia'
import { CheckSpin } from '@LowCode/components/index'

const spinning = ref(false)
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  showTip: {
    type: Boolean,
    default: true,
  },
})
const productStore = useProduct()
const { info } = storeToRefs(productStore)

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

const handleVisible = (key: string, value: boolean) => {
  visibles[key] = value
}
const goPreview = () => {
  showPreview.value = true
}

const showColumns = ref(true)
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
  pageName: computed({
    get() {
      return props.data.title
    },
    set(val) {},
  }),
  main: true,
  name: '',
  icon: '',
})
const listFormInfo = reactive({
  customIcon: '',
  dynamicIcon: '',
  field2Title: '',
  field3Title: '',
  field1: '',
  field2: '',
  field3: '',
  emphasisField: '',
  specialStyle: `{
      "error": "#ff0000",
      "offline": "#999999",
      "warning": "#13c2c2"
    }`,
})
const showType = reactive({
  type: 'list',
  configured: ['list'],
  configurationShow: false,
  defaultForm: 'list',
  showColumns: false,
})
const listPageData = computed(() => {
  return {
    addButton: buttonsConfig.value,
    actionsButton: actionsConfig.value,
    dataSource: dataSource.value,
    searchData: searchData.value,
    pagingData: pagingData.value,
    menu: menuConfig,
    dataBind,
    listFormInfo,
    showType,
    showColumns: showColumns.value,
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
  spinning.value = true
  const errorList = [
    ...btnTreeRef.value?.valid(),
    ...columnsRef.value?.valid(),
    ...pagingConfigRef.value?.valid(),
    ...listFormRef.value?.valid(),
    ...listDataRef.value?.valid(),
    ...menuConfigRef.value?.valid(),
    ...dataBindRef.value?.valid(),
  ]

  return new Promise((resolve, reject) => {
    filterModuleRef.value?.valid().then((res) => {
      errorList.push(...res)
      if (errorList.length) {
        reject(errorList)
      } else {
        if (props.showTip) {
          onlyMessage('校验通过')
        }
        resolve([])
      }
      spinning.value = false
    })
    // Promise.all(promiseArr)
    //   .then((res) => {
    //     resolve(res)
    //   })
    //   .catch((err) => {
    //     reject(err)
    //   })
    //   .finally(() => {
    //     spinning.value = false
    //   })
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
    dataBind: dataBindRef.value?.errorList.length,
  }
})

const configDone = computed(() => {
  return {
    btn: buttonsConfig.value?.length,
    actions: actionsConfig.value?.length,
    filterModule: searchData.value?.length,
    listData: dataSource.value?.length,
    pagination: pagingData.value?.length,
    ListForm: listFormInfo,
  }
})

const dataBind = reactive({
  data: {
    function: null,
    command: null,
    dataSource: [],
  },
  dataFrom: null,
  async: false,
})

provide(DATA_BIND, dataBind)
provide(BASE_INFO, props.data)
provide(SHOW_TYPE_KEY, showType)
provide(MENU_CONFIG, menuConfig)
provide(LIST_PAGE_DATA_KEY, listPageData)
provide(LIST_FORM_INFO, listFormInfo)
provide(DATA_SOURCE, dataSource)
provide(SEARCH_DATA, searchData)
provide(showColumnsKey, showColumns)
provide(ACTION_CONFIG_KEY, actionsConfig)
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

//树形结构转换成数组
const arrFlat = (arr: any[]) => {
  const arr_: any[] = []
  function flat(arr: any[]) {
    arr.forEach((item) => {
      arr_.push({ id: item.type === 'Delete' ? 'delete' : item.key, name: item.type === 'Delete' ? '删除' : item.title })
      if (item.children) {
        flat(item.children)
      }
    })
  }
  flat(arr)
  return arr_
}

onMounted(() => {
  visibles.GuideVisible = !props.data.configuration?.code
  const initData = JSON.parse(props.data.configuration?.code || '{}')
  if (initData) {
    Object.assign(dataBind, initData?.dataBind)
    Object.assign(showType, initData?.showType)
    Object.assign(menuConfig, omit(initData?.menu, 'buttons'))
    Object.assign(listFormInfo, initData?.listFormInfo)
    pagingData.value = initData?.pagingData || pagingData.value
    buttonsConfig.value = initData?.addButton || []
    actionsConfig.value = initData?.actionsButton || []
    searchData.value = initData?.searchData || []
    dataSource.value = initData?.dataSource || []
    showColumns.value =
      initData?.showColumns !== undefined
        ? initData?.showColumns
        : showColumns.value
  }
  setTimeout(() => {
    watch(
      () => JSON.stringify(listPageData.value),
      () => {
        filterQuote()
        if (!listPageData.value.dataBind.data.function) {
          listFormInfo.field1 =
            listFormInfo.field2 =
            listFormInfo.field3 =
            listFormInfo.emphasisField =
            listFormInfo.field2Title =
            listFormInfo.field3Title =
              ''
        }
        const record = {
          ...props.data,
          configuration: {
            type: 'list',
            code: JSON.stringify(listPageData.value),
          },
          others: {
            ...props?.data?.others,
            menu: {
              ...menuConfig,
              buttons: [
                ...arrFlat(buttonsConfig.value),
                ...arrFlat(actionsConfig.value),
              ].filter((item, index) => {
                return index === [...arrFlat(buttonsConfig.value), ...arrFlat(actionsConfig.value)].findIndex((obj) => obj.id === item.id)
              }),
            },
            useList: Array.from(
              new Set([
                ...actionsQuote(actionsConfig.value),
                ...actionsQuote(buttonsConfig.value),
                  ...filterQuote(),
                  dataBindQuote()
              ]),
            ),
          },
        }
        onSave(record)
      },
    )
  })
})

const filterQuote = () => {
  return searchData.value
    .filter((item) => item.config?.abilityValue)
    ?.map((item) => findFunctionId(item.config?.abilityValue)?.id)
}

const dataBindQuote = () => {
  return findFunctionId(dataBind.data.function!)?.id
}

const actionsQuote = (arr: any[]) => {
  let pages: string[] = [];
  let functions: string[] = [];
  arr.forEach((item) => {
    if(!isEmpty(item.pages)) {
      pages.push(item.pages)
    }
    if(!isEmpty(item.functions)) {
      functions.push(findFunctionId(item.functions)?.id)
    }
  })
  return [...pages, ...functions]
}


const findFunctionId = (fullId: string) => {
  const functionArr = [...productStore.getDataMap().values()];
  return functionArr.find(item => item.fullId === fullId)
}

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

defineExpose({
  validate,
})
</script>

<style lang="less">
.list-page {
  height: 100%;
  position: relative;
  background-color: #e9e9e9;
}
.options-img {
  width: 20px;
}
</style>
