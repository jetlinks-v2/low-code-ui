<template>
  <div class="list-form-preview">
    <div class="header">
      <j-page-header>
        <template #subTitle>
          <span class="sub-title">正在预览</span>
        </template>
        <template #extra>
          <j-button key="1" @click="back">退出预览</j-button>
        </template>
      </j-page-header>
    </div>
    <div style="padding: 30px">
      <div style="padding: 30px; background-color: #f2f2f2">
        <pro-search
          :columns="searchColumns"
          target="code"
          @search="handleSearch"
        />

        <div style="background-color: #ffffff">
          <j-radio-group
            v-model:value="model"
            class="right-button"
            v-if="typeChangeShow"
            @change="typeChange"
          >
            <j-radio-button value="list">
              <AIcon class="right-button-icon" type="UnorderedListOutlined" />
            </j-radio-button>
            <j-radio-button value="card">
              <AIcon class="right-button-icon" type="AppstoreOutlined" />
            </j-radio-button>
          </j-radio-group>
          <ProTable
            :query="query"
            :pagination="pagination"
            :model="model"
            :cardConfig="cardConfig"
            :dataColumns="dataColumns"
            :headerActions="headerActions"
            @openJson = "(newValue) => (jsonData = newValue)"
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
      v-model:open="exmportVisible"
      @close="exmportVisible = false"
      @save="exmportVisible = false"
    />
    <!-- 新增 -->
    <Add
      v-model:open="addVisible"
      @close="addVisible = false"
      @save="addVisible = false"
    />
    <!-- 查看 -->
    <JsonPreview
      v-model:open="jsonData.previewVisible"
      :json="jsonData.value"
      @close="jsonData.previewVisible = false"
    />
  </div>
</template>
<script setup lang="ts">
import { useAllListDataStore } from '@/store/listForm'
import ProTable from '@/components/ListPage/Preview/components/TableModel.vue'
import dayjs from 'dayjs'
import { router } from '@jetlinks/router'
import Import from './components/Import.vue'
import Export from './components/Export.vue'
import Add from './components/Add.vue'
import JsonPreview from './components/JsonPreview.vue'
const importVisible = ref<boolean>(false)
const exmportVisible = ref<boolean>(false)
const addVisible = ref<boolean>(false)

const route = useRoute()
const id = route.params.id
const listDataStore = useAllListDataStore()
const allData = ref<any>({})
const jsonData = ref<any>({
  previewVisible:false,
  value:{}
})
const dataColumns: any = ref([])
const searchColumns: any = ref([])
const typeChangeShow = ref(false)
//操作按钮
const actions = ref([
  {
    key: 'view',
    text: '查看',
    icon: 'EyeOutlined',
    type: 'primary',
    permissionProps: (data) => ({
      tooltip: {
        title: '查看',
      },
      hasPermission: false,

      onClick: (e) => {
        console.log(data, 'data')
        // handleView(data.id)
      },
    }),
  },
  {
    key: 'view1',
    text: '查看1',
    icon: 'FormOutlined',
    type: 'primary',
    permissionProps: (data) => ({
      tooltip: {
        title: '查看',
      },
      hasPermission: false,

      onClick: (e) => {
        console.log(data)
        // handleView(data.id)
      },
    }),
  },
  {
    key: 'view2',
    text: '查看2',
    type: 'dashed',
    icon: 'FrownOutlined',
    permissionProps: (data) => ({
      tooltip: {
        title: '查看',
      },
      hasPermission: false,
      onClick: (e) => {
        console.log(data)
        // handleView(data.id)
      },
    }),
  },

  {
    key: 'delete',
    text: '删除',
    icon: 'DeleteOutlined',
    type: 'primary',
    permissionProps: (data) => ({
      tooltip: {
        title: '删除',
      },
      popConfirm: {
        title: data?.status === 'error' ? '禁用' : '确认删除？',
        onConfirm: () => {
          console.log(data, 'onConfirm')
        },
      },
      hasPermission: true,
      // onClick: () => {
      //   handleView(data.id)
      // },
    }),
  },
])
//table头部按钮
const headerActions = ref([
  {
    key: 'view',
    text: '查看',
    icon: 'EyeOutlined',
    type: 'primary',
    permissionProps: (data) => ({
      tooltip: {
        title: '查看',
      },
      hasPermission: false,

      onClick: (e) => {
        console.log(data, 'data')
        // handleView(data.id)
      },
    }),
  },
  {
    key: 'view1',
    text: '查看1',
    icon: 'FormOutlined',
    type: 'primary',
    permissionProps: (data) => ({
      tooltip: {
        title: '查看',
      },
      hasPermission: false,

      onClick: (e) => {
        console.log(data)
        // handleView(data.id)
      },
    }),
  },
  {
    key: 'view2',
    text: '查看2',
    type: 'dashed',
    icon: 'HeatMapOutlined',
  },

  {
    key: 'delete',
    text: '删除',
    icon: 'DeleteOutlined',
    type: 'primary',
    permissionProps: (data) => ({
      tooltip: {
        title: '删除',
      },
      popConfirm: {
        title: data?.status === 'error' ? '禁用' : '确认删除？',
        onConfirm: () => {
          console.log(data, 'onConfirm')
        },
      },
      hasPermission: true,
      // onClick: () => {
      //   handleView(data.id)
      // },
    }),
  },
])
//卡片样式
const cardConfig = ref({
  customIcon: '',
  dynamicIcon: '',
  field2Titel: '',
  field3Titel: '',
  field1: '',
  field2: '',
  field3: '',
  emphasisField: '',
  specialStyle: '',
})
const dataSource = [
  {
    deviceId1: 'https://aliyuncdn.antdv.com/form/static/logo-blue.png',
    deviceId2: 'discussion2',
    deviceId3: 'discussion3',
    deviceId4: 'discussion4',
    deviceId5: 'https://aliyuncdn.antdv.com/form/static/logo-blue.png',
    deviceId6: 'discussion2',
    deviceId7: { url: 'https://aliyuncdn.antdv.com/form/static/logo-blue.png' },
    deviceId8: 'discussion4',
  },
  {
    deviceId1: 'discussion1',
    deviceId2: 'discussion2',
    deviceId3: 'discussion3',
    deviceId4: 'discussion4',
  },
  {
    deviceId1:
      'https://gw.alipayobjects.com/zos/rmsportal/nBVXkrFdWHxbZlmMbsaH.svg',
    deviceId2: 'discussion2',
    deviceId3: 'discussion3',
    deviceId4: 'discussion4',
  },
  {
    deviceId1: 'discussion1',
    deviceId2: 'discussion2',
    deviceId3: 'discussion3',
    deviceId4: 'discussion4',
  },
]

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
    map.set(item, item.pageSize)
  }
  pagination.pageSizeOptions = [...map.values()]
  pagination.defaultPageSize = [...map.values()][0] || 12
}
//table头部
const tableHeader = () => {
  const cloumn = allData.value?.datasource || []
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
        type: item.type === 'date' ? componentProps?.type : item.type,
        componentProps: {
          placeholder: placeholder,
          ...componentProps,
        },
      },
    }
  })
}
//table形态选择
const typeData = () => {
  const showType = allData.value?.showType || {}
  typeChangeShow.value = showType.configured?.length === 2
  model.value =
    showType.configured?.length === 2
      ? showType.defaultForm
      : showType.configured[0]
}

const typeChange = (e: any) => {
  model.value = e?.target?.value
}
const actionsBtnFormat = (data: any) => {
  const finalData = data?.map((item: any) => {
    return {
      key: item?.key,
      text: item?.title,
      icon: item?.icon,
      type: 'primary',
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
                onConfirm: () => {
                  console.log(data, 'onConfirm')
                  item?.script
                },
              }
            : false,
        onClick: () => {
          const fn = new Function(item.script)
          fn();
          console.log(data, 'datafdnh')
          importVisible.value = data?.command === 'Import'
          exmportVisible.value = data?.command === 'Export'
          addVisible.value = data?.command === 'Add'
          item?.script
          // handleView(data.id)
        },
      }),
      children: actionsBtnFormat(item?.children || []),
    }
  })
  return finalData
}
//表头按钮
const handleHeaderActions = () => {
  const btnData = listDataStore.getALLlistDataInfo(id)?.addButton || []
  headerActions.value = actionsBtnFormat(btnData)
}
//table操作按钮
const handleRowActions = () => {
  const btnData = listDataStore.getALLlistDataInfo(id)?.actionsButton || []
  actions.value = actionsBtnFormat(btnData)
}
//table数据
const query = (_params: Record<string, any>) =>
  new Promise((resolve) => {
    let map = new Map()
    dataColumns.value.map((item: any, index: number) => {
      map.set(item.key, { config: item.config, key: item.key })
    })
    const newData = [...map.values()]
    let data: any = []
    data = dataSource.map((item, index) => {
      for (let i in item) {
        const datasourceItem = newData?.find(
          (e: any) => e.key === i && e.config,
        )

        if (datasourceItem && !item[i]?.config) {
          item[i] = { value: item[i], config: datasourceItem.config }
        }
      }
      return {
        ...item,
        key: index,
        actions: actions.value,
      }
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
//tablemodel
const model = ref('list')
const params = ref()
const handleSearch = (data: any) => {
  params.value = data
}
//退出预览
const back = () => {
  router.go(-1)
}

onMounted(() => {
  allData.value = listDataStore.getALLlistDataInfo(id)
  //分页
  pagingData()
  //卡片样式
  cardConfig.value = allData.value?.listFormInfo || {}
  //列表头部
  tableHeader()
  //筛选search
  searchData()
  //table形态选择
  typeData()
  //table头部按钮
  handleHeaderActions()
  //table操作按钮
  handleRowActions()
})
</script>
<style lang="less" scoped>
.list-form-preview {
  background-color: #d7d7d7;
}
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
