<template>
  <div class="preview">
    <div style="padding: 30px; background-color: #f2f2f2">
      <j-advanced-search
        :columns="searchColumns"
        :target="target"
      />

      <div style="background-color: #ffffff">
        <ProTable
          :query="query"
          :pagination="pagination"
          :model="tableForm"
          :cardConfig="cardConfig"
          :dataColumns="dataColumns"
          :headerActions="headerActions"
          :defaultFormType="defaultFormType"
          :tableActions="actions"
          @openJson="(newValue) => (jsonData = newValue)"
          :showColumnOptions="allData.showType?.showColumns"
          ref="tableRef"
        />
      </div>
    </div>
  </div>
  <!-- 批量导入 -->
  <Import
    v-model:open="importVisible"
    @close="importVisible = false"
    @save="importVisible = false"
  />
  <!-- 批量导出 -->
  <Export
    v-model:open="exportVisible"
    @close="exportVisible = false"
    @save="exportVisible = false"
  />
  <!-- 新增 -->
  <Add
    v-model:open="addVisible"
    :resource="popResource"
    :popTitle="popTitle"
    @close="addVisible = false"
    @save="addVisible = false"
  />
  <!-- 查看 -->
  <JsonPreview
    v-model:open="jsonData.previewVisible"
    :json="jsonData.value"
    @close="jsonData.previewVisible = false"
  />
</template>

<script setup lang="ts" name="Preview">
import ProTable from './tableModel.vue'
import dayjs from 'dayjs'
import Import from './Import.vue'
import Export from './Export.vue'
import Add from './Add.vue'
import JsonPreview from './JsonPreview.vue'

const props = defineProps({
  data: {
    type: String,
    default: '{}'
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

const target = computed(() => {
  return `${props.projectId}.${props.pageId}`
})
const emits = defineEmits()
const importVisible = ref<boolean>(false)
const exportVisible = ref<boolean>(false)
const addVisible = ref<boolean>(false)
const tableRef = ref()

const allData = computed(() => {
  return JSON.parse(props.data || '{}')
})

const tableForm = computed(() => {
  return allData.value?.showType?.configured.length == 2 ? '' : allData.value?.showType?.configured.includes('list') ? 'TABLE' : 'CARD'
})

const defaultFormType = computed(() => {
  return allData.value?.showType?.defaultForm == 'list' ? 'TABLE' : 'CARD';
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
      sorter: item.config?.checked
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
const popTitle = ref('')
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
const popResource= ref<Record<string, any>>({})

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
      ellipsis: true,
      scopedSlots: true,
      align: item?.config?.colLayout,
      config: item.config,
      width: 200,
    }
  })
  if (actions.value?.length !== 0) {
    dataColumns.value.push({
      title: '操作',
      key: 'action',
      scopedSlots: true,
      width: actions.value?.length * 80,
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
        format: format,
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
    const placeholder = item.type === 'date' ? '请选择' : '请输入'
    const componentProps = componentPropsSwitch(item) || {}
    return {
      title: item.name,
      dataIndex: item.id,
      key: item.id,
      ellipsis: true,
      search: {
        type: searchType(item.type),
        componentProps: {
          placeholder: placeholder,
          ...componentProps,
        },
      },
    }
  })
}

const searchType = (type_: string) => {
  let type = '';
  switch(type_) {
    case 'enum':
      type = 'select'
    break;
    default:
      type = type_
    break
  }
  return type;
}
const actionsBtnFormat = (data: any, type: string) => {
  const finalData = data?.map((item: any) => {
    let result = {
      ...item,
      key: item?.command === 'Delete' ? 'delete' : item?.key,
      text: item?.title,
      icon: type == 'actions' ? item?.icon || 'SettingOutlined' : item?.icon,
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
      
                },
              }
            : false,
        onClick: () => {
          handleActions(data, item)
        },
      }),
      children: actionsBtnFormat(item?.children || [], type),
    }
    if (item.title == '批量删除') {
      result['selected'] = {
        popConfirm: {
          title: '确认删除吗？',
          onConfirm: async () => {}
        },
      }
    } else if (item.title === '批量导出') {
      result['selected'] = {
        popConfirm: {
          title: '确认导出吗？',
          onConfirm: async () => {
            handleActions(item, item)
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
  popTitle.value = config?.title
  if (
    config.type === 'Add' ||
    config.type === 'Update' ||
    config.type === 'Detail'
  ) {
    // if(config.resource.type === providerEnum.FormPage) {
    addVisible.value = true
    popResource.value = config.resource
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
  console.log(`output->btnData`,btnData)
  headerActions.value = actionsBtnFormat(btnData, 'headerActions')
}
//table操作按钮
const handleRowActions = () => {
  const btnData = allData.value?.actionsButton || []
  actions.value = actionsBtnFormat(btnData, 'actions')
}
//table数据
const query = (_params: Record<string, any>) =>
  new Promise((resolve) => {
    let map = new Map()
    dataColumns.value.map((item: any, index: number) => {
      map.set(item.key, { config: item.config, key: item.key })
    })
    console.log(map);
    let data: any = new Array(22).fill(1).map((item, index) => {
      const obj = {}
      map.forEach((value, key) => {
        obj[key] = key
      })
      return obj
    })
    const _from = _params.pageIndex * _params.pageSize
    const _to = (_params.pageIndex + 1) * _params.pageSize
    setTimeout(() => {
      resolve({
        result: {
          data: data.slice(_from, _to),
          pageIndex: _params.pageIndex || 0,
          pageSize: _params.pageSize || 10,
          total: data.length,
        },
        status: 200,
      })
    }, 500)
  })
const params = ref()
const handleSearch = (data: any) => {
  params.value = data
}

watch(() => JSON.stringify(allData.value), () => {
  console.log(`output->allData.value`,allData.value)
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
}, { immediate: true })
</script>

<style lang="less" scoped>
.ant-page-header {
  padding: 2px 20px 2px 20px;
}
.header {
  background-color: #808080;
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
</style>