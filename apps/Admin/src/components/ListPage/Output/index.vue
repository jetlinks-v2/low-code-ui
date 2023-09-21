<template>
  <div class="preview">
    <div>
      <pro-search
        :columns="searchColumns"
        target="code"
        @search="handleSearch"
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
          :params='params'
          :tableActions="actions"
          @openJson="(newValue) => (jsonData = newValue)"
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
import Import from '../Preview/components/Import.vue'
import Export from '../Preview/components/Export.vue'
import CallPage from './components/CallPages.vue'
import JsonPreview from '../Preview/components/JsonPreview.vue'
import { queryRuntime } from '@/api/form'
import { PropType } from 'vue'

const props = defineProps({
  data: {
    type: String,
    default: '{}'
  },
  info: {
    type: Object as PropType<Record<string, any>>,
    default: () => {}
  }
})

const importVisible = ref<boolean>(false)
const exportVisible = ref<boolean>(false)
const addVisible = ref<boolean>(false)

const allData = computed(() => {
  return JSON.parse(props.data || '{}')
})

const tableRef = ref()
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
      ellipsis: true,
      scopedSlots: true,
      align: item?.config?.colLayout,
      config: item.config,
    }
  })
  if (actions.value?.length !== 0 && allData.value?.showColumns) {
    arr.push({
      title: '操作',
      key: 'action',
      scopedSlots: true,
      width: actions.value?.length * 80 + `px`,
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

const popResource= ref<Record<string, any>>({})
const commandType = ref<string>('')
const popData = ref<Record<string, any>>({})

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
    }
  })
  if (actions.value?.length !== 0) {
    dataColumns.value.push({
      title: '操作',
      key: 'action',
      scopedSlots: true,
      width: actions.value?.length * 80 + `px`,
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
        item?.config?.accuracy === 'hour' ? 'HH:mm:ss' : 'YYYY-MM-DD'
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

const actionsBtnFormat = (data: any) => {
  const finalData = data?.map((item: any) => {
    return {
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
          item?.command === 'Delete'
            ? {
                title: data?.status === 'error' ? '禁用' : '确认删除？',
                onConfirm: async () => {
                  const res = await queryRuntime(props.info.id, item.functions, item.command, {terms: [{column: 'id', termType: 'eq', value: data.id}]})
                  if(res.success) {
                    tableRef.value?.reload?.();
                  }
                },
              }
            : false,
        onClick: () => {
          if(item.script) {
            eval(item.script)
          }
          console.log(data, item);
          importVisible.value = data?.command === 'Import'
          exportVisible.value = data?.command === 'Export'
          addVisible.value = !!item.pages
          popResource.value = {
            callPage: item.resource || [],
            function: item.functions,
            command: item.command
          }
          popData.value = item?.command === 'Update' ? data : undefined
          commandType.value = item.command
        },
      }),
      children: actionsBtnFormat(item?.children || []),
    }
  })
  return finalData
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
  return queryRuntime(props.info.id, allData.value?.dataBind.data.function, allData.value?.dataBind.data.command, _params)
}
const params = ref()
const handleSearch = (data: any) => {
  params.value = data
}

const reloadTable = () => {
  tableRef.value?.reload();
  addVisible.value = false;
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