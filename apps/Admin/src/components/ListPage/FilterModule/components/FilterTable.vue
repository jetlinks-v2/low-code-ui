<template>
  <div className="filter-table">
    <div class="tips">{{ props.title }}</div>
    <j-button
      @click="syncData"
      myIcon="SyncOutlined"
      size="small"
      :type="dataBinds.data.dataSource.length ? 'primary' : 'default'"
    >
      同步数据绑定
    </j-button>
    <j-data-table
      columnDrag
      class="ant-table-striped table-striped"
      rowKey="rowKey"
      bordered
      ref="tableRef"
      size="small"
      :columns="props.columns"
      :data-source="props.dataSource"
      :showTool="false"
      :height="900"
      @change="(data) => handleChange(data)"
    >
      <template #headerCell="{ column }">
        <template v-if="column.tips">
          <span>
            {{ column.title }}
            <j-popover trigger="hover">
              <template #content>
                <div class="hover-tips">
                  <div>不同于列自身的数据类型，筛选组件提供string、enum、<br>date、number四种数据类型，用于控制运算符和筛选值样式</div>
                  <j-table
                    :columns="tipsColumns"
                    :data-source="data"
                    :pagination="false"
                    bordered
                    size="small"
                  />
                </div>
              </template>
              <AIcon type="QuestionCircleOutlined" />
            </j-popover>
          </span>
        </template>
      </template>
      <template #name="{ data }">
        <ErrorItem :border="false" :errorData="errorData('name' + data.record?._sortIndex)">
          <span class="data-column">{{ data.record?.name }}</span>
        </ErrorItem>
      </template>
      <template #id="{ data }">
        <ErrorItem :border="false" :errorData="errorData('id' + data.record?._sortIndex)">
          <span class="data-column">{{ data.record?.id }}</span>
        </ErrorItem>
      </template>
      <template #action="{ data }">
        <j-space>
          <j-button type="link" @click="configuration(data)" :style="{ color: errorData('config' + data.record?._sortIndex) ? 'red' : '' }">配置</j-button>
          <JPopconfirm
            @confirm="confirm(data)"
            :loading="loading"
            title="确定删除此数据？"
          >
            <j-button type="text" danger>删除</j-button>
          </JPopconfirm>
        </j-space>
      </template>
    </j-data-table>
    <br />
    <j-button
      class="editable-add-btn"
      @click="handleAdd"
      type="dashed"
    >
      + {{ props.addBtnName }}
    </j-button>
    <!--处理方式弹窗-->
    <j-modal
      :visible="visible"
      width="800px"
      title="数据绑定内容有变动，请选择处理方式"
      @ok="handleOk"
      @cancel="handleCancel"
      class="handle-modal"
    >
    <j-card-select v-model:value="activeKey" float="right" :options="handleOptions">
      <template #image="data">
        <img :src="getImage(data.option.image)">
      </template>
    </j-card-select>
    </j-modal>
  </div>
</template>

<script lang="ts" setup>
import { onlyMessage } from '@/utils/comm'
import { ErrorItem } from '../..'
import type { PropType } from 'vue'
import { useProduct } from '@/store';
import { getImage, randomString } from '@jetlinks/utils';
import { cloneDeep } from 'lodash-es';
import { DATA_BIND } from '../../keys';
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  show: {
    type: Boolean,
    default: false,
  },
  //是否完成数据绑定
  dataBind: {
    type: Boolean,
    default: false,
  },
  //是否同步
  asyncData: {
    type: Boolean,
    default: false,
  },
  tableType: {
    type: String,
    default: ''
  },
  //数据是否有变动
  dataChange: {
    type: Boolean,
    default: false,
  },
  //处理方式弹窗activeKey
  modelActiveKey: {
    type: String,
    default: '',
  },
  //表格col
  columns: {
    type: Array as PropType<any[]>,
    default: () => [],
    required: true,
  },
  //表格data
  dataSource: {
    type: Array as PropType<any[]>,
    default: () => [],
    required: true,
  },
  //处理类型
  handleOptions: {
    type: Array as PropType<any[]>,
    default: () => [
      {
        value: '1',
        label: '覆盖',
        subLabel: '以下功能的数据覆盖页面已有内容',
        image: '/list-page/cover.png',
      },
      {
        value: '2',
        label: '追加',
        subLabel: '在页面已有内容的基础上追加新增内容',
        image: '/list-page/append.png',
      },
      {
        value: '3',
        label: '忽略',
        subLabel: '保留页面已有内容，忽略变动',
        image: '/list-page/ignore.png',
      },
    ],
  },
  //新增按钮名称
  addBtnName: {
    type: String,
    default: '新增',
  },
  //校验错误
  errorList: {
    type: Array,
    default: () => [],
  },
  //绑定功能表数据
  bindData: {
    type: Array as PropType<Record<string, any>>,
    default: () => []
  },
  bindFunctionId: {
    type: String,
    default: ''
  }
})

const dataBinds = inject(DATA_BIND)
enum javaType {
  enum = 'enum',
  string = 'text',
  double = 'double',
  int = 'int',
  bigDecimal = 'text',
  dateTime = 'date',
  date = 'date',
  float = 'float',
  byte = 'int',
  long = 'long',
  list = 'array',
  boolean = 'boolean',
  object = 'object',
}

enum filterType {
  enum = 'enum',
  string = 'string',
  double = 'number',
  int = 'number',
  bigDecimal = 'string',
  dateTime = 'date',
  date = 'date',
  float = 'number',
  byte = 'number',
  long = 'number',
  list = 'string',
  boolean = 'enum',
  map = 'string',
  object = 'enum',
  array = 'string'
}


const tableRef = ref()
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const emit = defineEmits([
  'configuration',
  'confirm',
  'syncData',
  'handleAdd',
  'handleOk',
  'handleChange',
  'update:data',
  'bindData',
  'updateBind',
  'update:asyncData'
])

const handleChange = (data) => {
  data = data.map((item) => {
    if(props.dataSource.find(val => val.id === item.id)?.type !== item.type) {
      console.log(item);
      item.config = null
    }
    return item
  })
  emit('handleChange', data)
}

const activeKey = ref(['1'])

const errorData = computed(() => {
  return (val: string): any => {
    return props.errorList?.find((item: any) => item.key === val)
  }
})

//提示col
const tipsColumns: any = [
  {
    title: '筛选项类型',
    dataIndex: 'type',
    width: '120px',
    customCell: (_, index) => {
      if (index === 1) {
        return { rowSpan: 2 }
      }
      if (index === 2) {
        return { colSpan: 0 }
      }
      if (index === 3) {
        return { colSpan: 1 }
      }
      if (index === 4) {
        return { colSpan: 1 }
      }
      if (index === 5) {
        return { colSpan: 0 }
      }
    },
  },
  {
    title: '运算符',
    dataIndex: 'operator',
    customCell: (_, index) => {
      if (index === 2) {
        return { colSpan: 1 }
      }
      if (index === 3) {
        return { colSpan: 1 }
      }
      if (index === 4) {
        return { colSpan: 1 }
      }
      if (index === 5) {
        return { colSpan: 0 }
      }
    },
  },
  {
    title: '筛选值',
    dataIndex: 'filterValues',
    customCell: (_, index) => {
      if (index === 2) {
        return { rowSpan: 1 }
      }
      // These two are merged into above cell
      if (index === 3) {
        return { rowSpan: 1 }
      }
      if (index === 4) {
        return { rowSpan: 1 }
      }
      if (index === 5) {
        return { colSpan: 0 }
      }
    },
  },
]
//类型提示
const data = [
  {
    key: '1',
    type: 'string',
    operator: '包含，不包含',
    filterValues: '输入框',
  },
  {
    key: '2',
    type: 'enum',
    operator: '=，!=',
    filterValues: '可输入下拉框',
  },
  {
    key: '3',
    type: 'enum',
    operator: '在...之中，不在...之中',
    filterValues: '可输入多选下拉框',
  },
  {
    key: '4',
    type: 'date',
    operator: '>,>=,<,<=',
    filterValues: '下拉框',
  },
  {
    key: '5',
    type: 'number',
    operator: '=,!=,<,<=,>,>=',
    filterValues: '输入框',
  },
]

//新增一列table
const handleAdd = async () => {
  emit('handleAdd', tableRef.value)
}
//配置
const configuration = async (data: any) => {
  const dataSource = await tableRef.value.getData()
  emit('configuration', data, dataSource)
}
//删除
const confirm = (data: any) => {
  loading.value = true
  emit('confirm', data)
  tableRef.value.removeItem(data.index)
  loading.value = false
}
const bindShow = ref(false)
//是否同步数据绑定
//同步数据绑定
const syncData = async () => {
  if (dataBinds.data.dataSource.length === 0) {
    bindShow.value = false
    return onlyMessage('请先完成数据绑定', 'error')
  }
  const changeFunctionData = asyncDataBind()
  if(!props.asyncData) { 
    handleChange([...props.dataSource, ...asyncDataBind()])
    emit('update:asyncData', true)
    emit('updateBind', cloneDeep([...props.dataSource, ...asyncDataBind()]))
    return
  }
  tempData.value = [];
  changeFunctionData.forEach((item) => {
    let find = props.bindData?.find((i) => i.id === item.id)
    if(!find) tempData.value.push(item)
  })
  if (tempData.value.length || changeFunctionData.length !== props.bindData.length) {
    openModel(props.modelActiveKey)
  } else {
    onlyMessage('已是最新数据', 'success')
  }
}

const asyncDataBind = () => {
  return dataBinds.data.dataSource.map(item => {
    return {
      rowKey: randomString(8),
      ...item,
      type: props.tableType === 'columnData' ? javaType[item.type] : filterType[item.type],
    }
  }) || []
}
//打开弹窗
const openModel = (value: any) => {
  activeKey.value = value
  visible.value = true
}
//处理方式弹窗
const handleOk = async () => {
  const newBind = asyncDataBind()
  const dataSource = activeKey.value?.[0] === '1' ? newBind.map((item) => item) : tempData.value
  emit('updateBind', cloneDeep(newBind))
  const changeData = [...new Set([...dataSource, ...tempData.value].map(item => JSON.stringify(item)))].map(item => JSON.parse(item))
  tableRef.value.cleanEditStatus()
  emit('handleOk', activeKey.value?.[0], changeData)
  visible.value = false
}
const handleCancel = () => {
  visible.value = false
}

const tempData = ref<any[]>([])

watch(() => props.bindFunctionId, () => {
  if(!props.bindFunctionId) emit('update:asyncData', false);
  bindShow.value = true
  tempData.value = props.dataSource.length ? props.dataSource : props.bindData?.map(
    (item) => {
      return {
        id: item.alias,
        name: item.comment,
        type: props.tableType === 'columnData' ? javaType[item.javaType] : filterType[item.javaType],
        rowKey: randomString(8)
      }
    },
  )
}, { immediate: true })

</script>

<style scoped lang="less">
.filter-table {
  .tips {
    padding-bottom: 8px;
    .hover-tips {
      width: 400px;
    }
  }
    padding-top: 18px;
    .data-column{
      width: 100%;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  .editable-add-btn{
    width: 100%;
  }
}
.handle-modal {
  .custom-label {
    text-align: center;
  }

  .data-handle {
    border: 1px solid #f0f0f0 !important;
    cursor: pointer;
    &:hover {
      background: #bce8fb;
    }
  }
  .active {
    border: 1px solid @primary-color !important;
    cursor: pointer;
    &:hover {
      background: #bce8fb;
    }
  }
}

:deep(.ant-table-cell) {
  text-align: left !important;
}
:deep(.ant-btn-link) {
  padding: 0 !important;
}
:deep(.ant-btn-text) {
  padding: 0 !important;
}
:deep(.j-card-item.active) {
  background-color: var(--ant-primary-color);
  color: #ffffff;
  .sub-title {
    color: #ffffff !important;
  }
}
:deep(.sub-title) {
  color: #666666 !important;
}
</style>
