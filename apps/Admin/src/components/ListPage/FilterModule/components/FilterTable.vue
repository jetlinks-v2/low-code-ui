<template>
  <div className="filter-table">
    <div class="tips">{{ props.title }}</div>
    <j-button
      @click="syncData"
      myIcon="SyncOutlined"
      size="small"
      :type="props.dataBind ? 'primary' : 'stroke'"
    >
      同步数据绑定
    </j-button>
    <div class="table">
      <j-data-table
        class="ant-table-striped table-striped"
        rowKey="code"
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
              <j-popover trigger="hover">
                <template #content>
                  <div class="hover-tips">
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
              {{ column.title }}
            </span>
          </template>
        </template>
        <template #name="{ data }">
          <ErrorItem :border="false" :errorData="errorData(data.record.name)">
            <span>{{ data.record?.name }}</span>
          </ErrorItem>
        </template>
        <template #id="{ data }">
          <ErrorItem :border="false" :errorData="errorData(data.record.id)">
            <span>{{ data.record?.id }}</span>
          </ErrorItem>
        </template>
        <template #action="{ data }">
          <span>
            <a @click="configuration(data)">配置</a>
            <j-divider type="vertical" />
            <JPopconfirm
              @confirm="confirm(data)"
              :loading="loading"
              title="确定删除此数据？"
            >
              <a>删除</a>
            </JPopconfirm>
          </span>
        </template>
      </j-data-table>
    </div>
    <br />
    <j-button
      class="editable-add-btn"
      style="margin-bottom: 8px"
      type="link"
      @click="handleAdd"
    >
      + {{ props.addBtnName }}
    </j-button>
    <!--处理方式弹窗-->
    <j-modal
      :visible="visible"
      title="数据绑定内容有变动，请选择处理方式"
      @ok="handleOk"
      @cancel="handleCancel"
      class="handle-modal"
    >
      <j-row :gutter="16">
        <j-col
          :span="8"
          v-for="(item, index) in props.handleOptions"
          :key="index"
        >
          <j-card
            style="height: 150px"
            @click="() => handleSelect(item.value)"
            :class="activeKey === item.value ? 'active' : 'data-handle'"
          >
            <p class="custom-label">{{ item.label }}</p>
            <p class="custom-sub-label">{{ item.subLabel }}</p>
          </j-card>
        </j-col>
      </j-row>
    </j-modal>
  </div>
</template>

<script lang="ts" setup>
import { onlyMessage } from '@/utils/comm'
import { ErrorItem } from '../..'
import type { PropType } from 'vue'
import { DATA_BIND } from '../../keys';
import { useProduct } from '@/store';
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
      },
      {
        value: '2',
        label: '追加',
        subLabel: '在页面已有内容的基础上追加新增内容',
      },
      {
        value: '3',
        label: '忽略',
        subLabel: '保留页面已有内容，忽略变动',
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
})

enum javaType {
  Enum = 'enum',
  String = 'text',
  Double = 'double',
  Int = 'int',
  BigDecimal = 'text',
  DateTime = 'date',
  Float = 'float',
  Byte = 'int',
  Long = 'long',
  List = 'array',
  Boolean = 'boolean',
  Map = 'object',
}

enum filterType {
  Enum = 'enum',
  String = 'string',
  Double = 'number',
  Int = 'number',
  BigDecimal = 'string',
  DateTime = 'date',
  Float = 'number',
  Byte = 'number',
  Long = 'string',
  List = 'string',
  Boolean = 'string',
  Map = 'string',
}


const tableRef = ref()
const visible = ref<boolean>(false)
const dataBinds: any = inject(DATA_BIND)
const loading = ref<boolean>(false)
const emit = defineEmits([
  'configuration',
  'confirm',
  'syncData',
  'handleAdd',
  'handleOk',
  'handleChange',
  'update:data',
  'bindData'
])

const handleChange = (data) => {
  emit('handleChange', data)
}

const activeKey = ref('1')

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
const asyncData = ref(props.asyncData)
//同步数据绑定
const syncData = async () => {
  if (!props.dataBind) {
    bindShow.value = false
    return onlyMessage('请先完成数据绑定', 'error')
  }
  asyncDataBind()
  // tempData.value = await tableRef.value?.getData()
  // if (data?.length !== props.dataSource?.length || props.configChange) {
  if(!props.dataSource.length) {
    handleChange(tempData.value)
    return
  }
  if (tempData.value.length !== props.dataSource.length) {
    openModel(props.modelActiveKey)
  } else {
    onlyMessage('已是最新数据', 'success')
  }
}

const productStore = useProduct()
const asyncDataBind = async () => {
  const functionId = dataBinds.data.function.split('.')
  tempData.value = productStore.getById(functionId[functionId.length - 1])?.configuration?.columns?.map((item) => {
      return {
        id: item.alias,
        name: item.comment,
        type: props.tableType === 'columnData' ? javaType[item.javaType] : filterType[item.javaType],
      }
    },
  ) || []
}
//打开弹窗
const openModel = (value: any) => {
  activeKey.value = value
  visible.value = true
}
//处理方式弹窗
const handleOk = async () => {
  const dataSource = tempData.value
  tableRef.value.cleanEditStatus()
  emit('handleOk', activeKey.value, dataSource)
  visible.value = false
}
const handleCancel = () => {
  visible.value = false
}
const handleSelect = (key: string) => {
  activeKey.value = key
}

const tempData = ref([])

watch(() => JSON.stringify(dataBinds), () => {
  if(!dataBinds.function) asyncData.value = false;
  bindShow.value = true
  tempData.value = props.dataSource.length ? props.dataSource : dataBinds.functionInfo?.configuration?.columns?.map(
    (item) => {
      return {
        id: item.alias,
        name: item.comment,
        type: props.tableType === 'columnData' ? javaType[item.javaType] : filterType[item.javaType],
      }
    },
  )
}, { immediate: true })

</script>

<style scoped lang="less">
.filter-table {
  .tips {
    padding-bottom: 8px;
  }
  .table {
    padding-top: 18px;
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
</style>
