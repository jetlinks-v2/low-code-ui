<template>
  <div class="list-page-output">
    <CardBox :padding="0">
      <pro-search
        :columns="searchColumns"
        :target="target"
        @search="handleSearch"
      />
    </CardBox>
    <CardBox style="margin-top: 24px" :padding="0">
      <ProTable
        :query="query"
        :pagination="pagination"
        :model="tableForm"
        :cardConfig="cardConfig"
        :dataColumns="dataColumns"
        :headerActions="headerActions"
        :defaultFormType="defaultFormType"
        :params="params"
        :tableActions="actions"
        :projectId="projectId"
        :pageId="pageId"
        @openJson="(newValue) => (jsonData = newValue)"
        ref="tableRef"
      />
    </CardBox>
  </div>
  <!-- 批量导入 -->
  <Import
    v-model:open="importVisible"
    :popData="popData"
    :projectId="projectId"
    @close="importVisible = false"
    @save="handleImportOk"
  />
  <!-- 批量导出 -->
  <Export
    v-model:open="exportVisible"
    :popData="popData"
    :projectId="projectId"
    :selectedRowKeys="$refs.tableRef?._selectedRowKeys"
    @close="exportVisible = false"
    @save="handleExportOk()"
  />
  <!-- 新增 -->
  <CallPage
    v-model:open="addVisible"
    :resource="popResource"
    :type="commandType"
    :popData="popData"
    @close="addVisible = false"
    @save="addVisible = false"
    @reload="reloadTable"
  />
  <!-- 查看 -->
  <JsonPreview
    v-model:open="jsonData.previewVisible"
    :json="jsonData.value"
    @close="jsonData.previewVisible = false"
  />
</template>

<script setup lang="ts" name="Preview">
import ProTable from '../Preview/components/tableModel.vue'
import dayjs from 'dayjs'
import Import from './components/Import.vue'
import Export from './components/Export.vue'
import CallPage from './components/CallPages.vue'
import JsonPreview from '../Preview/components/JsonPreview.vue'
import { queryRuntime } from '@/api/form'
import { providerEnum } from '@/components/ProJect'
import { router } from '@jetlinks/router'
import { onlyMessage, randomString } from '@jetlinks/utils'
import { dictionaryItemList } from '@/api/list'

const props = defineProps({
  data: {
    type: String,
    default: '{}',
  },
  projectId: {
    type: String,
    default: '',
  },
  pageId: {
    type: String,
    default: '',
  },
})

const importVisible = ref<boolean>(false)
const exportVisible = ref<boolean>(false)
const addVisible = ref<boolean>(false)
const target = computed(() => {
  return `${props.projectId}.${props.pageId}`
})

const allData = computed(() => {
  return JSON.parse(props.data || '{}')
})

const tableRef = ref()
const tableForm = computed(() => {
  return allData.value?.showType?.configured.length == 2
    ? ''
    : allData.value?.showType?.configured.includes('list')
    ? 'TABLE'
    : 'CARD'
})

const defaultFormType = computed(() => {
  return allData.value?.showType?.defaultForm == 'list' ? 'TABLE' : 'CARD'
})
const jsonData = ref<any>({
  previewVisible: false,
  value: {},
})

const dataColumns: any = computed(() => {
  let arr: any[] = []
  const cloumn = allData.value?.dataSource || []
  arr = cloumn?.map((item: any, index: number) => {
    return {
      title: item.name,
      dataIndex: item.id,
      key: item.id,
      ellipsis: false,
      scopedSlots: true,
      align: item?.config?.colLayout,
      config: item.config,
      width: 200,
      sorter: item.config?.checked ? (a: any, b: any) => {
        if(typeof a?.[item.id] === 'number') {
          return a?.[item.id] - b?.[item.id]
        } else {
          return a?.[item.id]?.localeCompare(b?.[item.id], 'zh')
        }
      } : false
    }
  })
  if (actions.value?.length !== 0 && allData.value?.showColumns) {
    arr.push({
      title: '操作',
      key: 'action',
      scopedSlots: true,
      width: actions.value?.length * 40 + `px`,
      fixed: 'right',
    })
  }
  return arr
})
const searchColumns: any = ref([])
//操作按钮
const actions = ref([])
//table头部按钮
const headerActions = ref([])
//卡片样式
const cardConfig = ref({
  customIcon: '',
  dynamicIcon: '',
  field2Title: '',
  field3Title: '',
  field1: '',
  field2: '',
  field3: '',
  emphasisField: '',
  specialStyle: '',
})

const popResource = ref<Record<string, any>>({})
const commandType = ref<string>('')
const popData = ref<Record<string, any>>({})

const handleImportOk = () => {
  importVisible.value = false
  tableRef.value?.reload()
}

const handleExportOk = () => {
  exportVisible.value = false
  tableRef.value._selectedRowKeys = []
}

//分页
const pagination = reactive({
  //表格自带分页器的属性定义
  defaultPageSize: 12, //默认每页显示10条数据
  showSizeChanger: true,
  pageSizeOptions: ['12', '24', '48', '96'], //自定义每页显示多少条数据
})
const pagingData = () => {
  const paging = allData.value?.pagingData || []
  let map = new Map()
  for (let item of paging) {
    map.set(item, String(item.pageSize))
  }
  pagination.pageSizeOptions = [...map.values()]
  pagination.defaultPageSize = [...map.values()][0] || 12
}
//table头部
const tableHeader = () => {
  const cloumn = allData.value?.dataSource || []
  dataColumns.value = cloumn?.map((item: any, index: number) => {
    return {
      title: item.name,
      dataIndex: item.id,
      key: item.id,
      ellipsis: false,
      scopedSlots: true,
      align: item?.config?.colLayout,
      config: item.config,
    }
  })
  if (actions.value?.length !== 0) {
    dataColumns.value.push({
      title: '操作',
      key: 'action',
      scopedSlots: true,
      width: actions.value?.length * 80 + `px`,
      fixed: 'right',
    })
  }
}
//筛选选择器
const componentPropsSwitch = (item: any) => {
  const type = item.type
  let data = {}
  switch (type) {
    case 'date':
      const format =
        item?.config?.accuracy === 'hour' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
      const type = item?.config?.accuracy === 'hour' ? 'time' : 'date'
      const defaultValue =
        item?.config?.defaultValue === 'not'
          ? ''
          : type === 'date'
          ? dayjs(new Date())
          : dayjs(new Date()).format(format)
      data = {
        valueFormat: format,
        type: type,
        defaultValue: defaultValue,
        showTime: item?.config?.accuracy === 'hour'
      }
      break
    case 'enum':
      data = { maxLength: 2 }
      break
    case 'number':
      data = { max: item?.config?.max, min: item?.config?.min }
      break
    case 'string':
      data = { maxLength: item?.config?.value }
      break
  }
  return data
}
//筛选search
const searchData = () => {
  const cloumnS = allData.value?.searchData || []
  searchColumns.value = cloumnS?.map((item: any) => {
    console.log(item)
    const placeholder = item.type === 'date' ? '请选择' : '请输入'
    const componentProps = componentPropsSwitch(item) || {}
    return {
      title: item.name,
      dataIndex: item.id,
      key: item.id,
      ellipsis: false,
      search: {
        type: searchType(item.type),
        componentProps: {
          placeholder: placeholder,
          ...componentProps,
        },
        options: () => {
          if (item.config?.value === 'data') {
            return new Promise((resolve) => {
              const params = {
                terms: [
                  {
                    column: 'dictId',
                    termType: 'eq',
                    value: item.config?.dataValue
                  },
                  {
                    column: 'status',
                    value: 1,
                    termType: 'eq',
                    type: 'and'
                  }
                ]
              }
              dictionaryItemList(params).then((resp: any) => {
                resolve(resp.result?.data)
              })
            })
          } else if(item.config?.value == 'rearEnd') {
            return new Promise((resolve) => {
              queryRuntime(props.projectId, item.config?.abilityValue, item.config?.instructValue, {}).then((resp: any) => {
                let result = (resp.result?.data || resp.result)
                .filter((val) => val[item.config?.outputKey])
                .map(val => {
                  console.log(item.config);
                  return {
                    label: val[item.config?.outputKey],
                    value: val[item.config?.outputKey]
                  }
                })
                resolve(result)
              })
            })
          }
        },
      },
    }
  })
}

const searchType = (type_: string) => {
  let type = ''
  switch (type_) {
    case 'enum':
      type = 'select'
      break
    default:
      type = type_
      break
  }
  return type
}

const actionsBtnFormat = (data: any) => {
  const finalData = data?.map((item: any) => {
    let result = {
      ...item,
      key: item?.key,
      text: item?.title,
      icon: item?.icon,
      type: item?.type,
      command: item?.command,
      pages: item?.pages,
      permissionProps: (data: any) => ({
        tooltip: {
          title: item?.title,
        },
        hasPermission: false,
        popConfirm:
          item?.command === 'Delete' && item?.title !== '批量删除'
            ? {
                title: data?.status === 'error' ? '禁用' : '确认删除？',
                onConfirm: async () => {
                  const res = await queryRuntime(
                    props.projectId,
                    item.functions,
                    item.command,
                    {
                      terms: [{ column: 'id', termType: 'eq', value: data.id }],
                    },
                  )
                  if (res.success) {
                    tableRef.value?.reload?.()
                  }
                },
              }
            : false,
        onClick: () => {
          handleActions(data, item)
        },
      }),
      children: actionsBtnFormat(item?.children || []),
    }
    if (item.title == '批量删除') {
      result['selected'] = {
        popConfirm: {
          title: '确认删除吗？',
          onConfirm: async () => {
            if (!tableRef.value?._selectedRowKeys.length) {
              onlyMessage('请选择删除项', 'error')
              return
            }
            const params = {
              terms: [
                ...tableRef.value?._selectedRowKeys.map((item) => {
                  return {
                    value: item,
                    termType: 'eq',
                    column: 'id',
                    type: 'or',
                  }
                }),
              ],
            }
            const res = await queryRuntime(
              props.projectId,
              item.functions,
              item.command,
              params,
            )
            if (res.success) {
              tableRef.value._selectedRowKeys = []
              tableRef.value?.reload()
            }
          },
        },
      }
    } else if (item.title === '批量导出') {
      result['selected'] = {
        popConfirm: {
          title: '确认导出吗？',
          onConfirm: async () => {
            handleActions(item, item)
            // const res = await queryRuntime(
            //   props.projectId,
            //   item.functions,
            //   item.command,
            //   params,
            // )
            // if(res.success) {
            //   tableRef.value._selectedRowKeys = [];
            //   tableRef.value?.reload();
            // }
          },
        },
      }
    } else {
      result['onClick'] = (data_) => {
        handleActions(data_, item)
      }
    }
    return result
  })
  return finalData
}

//按钮操作
const handleActions = (
  data: Record<string, any>,
  config: Record<string, any>,
) => {
  popData.value = data
  if (
    config.type === 'Add' ||
    config.type === 'Update' ||
    config.type === 'Detail'
  ) {
    // if(config.resource.type === providerEnum.FormPage) {
    addVisible.value = true
    popResource.value = {
      callPage: config.resource || [],
      function: config.functions,
      command: config.command,
    }
    commandType.value = config.type
    // } else if(config.resource.type === providerEnum.HtmlPage) {
    //   router.push(`/preview/${config.resource.projectId}/${config.resource.parentId}/${config.resource.id}/html/${randomString(8)}`)
    // }
  }
  if (config.command === 'Import') {
    importVisible.value = data?.command === 'Import'
  }
  if (config.command === 'Export') {
    console.log(config, data)
    exportVisible.value = data?.command === 'Export'
  }
}
//表头按钮
const handleHeaderActions = () => {
  const btnData = allData.value?.addButton || []
  headerActions.value = actionsBtnFormat(btnData)
}
//table操作按钮
const handleRowActions = () => {
  const btnData = allData.value?.actionsButton || []
  actions.value = actionsBtnFormat(btnData)
}
//table数据
const query = (_params: Record<string, any>) => {
  return queryRuntime(
    props.projectId,
    allData.value?.dataBind.data.function,
    allData.value?.dataBind.data.command,
    _params,
  )
}
const params = ref()
const handleSearch = (data: any) => {
  params.value = data
}

const reloadTable = () => {
  tableRef.value?.reload()
  addVisible.value = false
}
watch(
  () => JSON.stringify(allData.value),
  () => {
    console.log(`output->allData.value`, allData.value)
    //分页
    pagingData()
    //卡片样式
    cardConfig.value = allData.value?.listFormInfo || {}
    //列表头部
    tableHeader()
    //筛选search
    searchData()
    //table形态选择
    //table头部按钮
    handleHeaderActions()
    //table操作按钮
    handleRowActions()
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
.list-page-output {
  height: 100%;
  overflow: auto;
  .ant-page-header {
    padding: 2px 20px 2px 20px;
  }
  .header {
    .sub-title {
      color: #f5f5f5;
      font-size: 20px;
    }
  }
  .right-button {
    padding: 16px 24px 0px;
    width: 100%;
    display: flex;
    justify-content: end;
    .right-button-icon {
      font-size: 16px;
    }
  }
}
</style>
