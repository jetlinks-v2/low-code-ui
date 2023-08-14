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
    <div class="table" v-if="props.asynData && props.dataBind">
      <j-data-table
        rowKey="code"
        :columns="props.columns"
        :data-source="props.dataSource"
        :pagination="false"
        bordered
        ref="tableRef"
        size="small"
        :height="200"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'type'">
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
              筛选项类型
            </span>
          </template>
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
      :confirmLoading="confirmLoading"
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
import { message } from 'ant-design-vue'
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  //是否完成数据绑定
  dataBind: {
    type: Boolean,
    default: false,
  },
  //是否同步数据绑定
  asynData: {
    type: Boolean,
    default: false,
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
        subLabel: '以功能下的数据覆盖页面已有内',
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
})
const tableRef = ref()
const visible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
const loading = ref<boolean>(false)
const emit = defineEmits([
  'configuration',
  'confirm',
  'syncData',
  'handleAdd',
  'handleOk',
])


const activeKey = ref('1')

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
const configuration = (data: any) => {
  tableRef.value.cleanEditStatus()
  emit('configuration', data)
}
//删除
const confirm = (data: any) => {
  loading.value = true
  emit('confirm', data)
  return new Promise((resolve) => {
    setTimeout(async () => {
      tableRef.value.removeItem(data.index)
      resolve(true)
      loading.value = false
    }, 1000)
  })
}
//同步数据绑定
const syncData = () => {
  if (!props.dataBind) {
    return message.error('请先完成数据绑定')
  } else {
    if (props.dataChange) {
      openModel(props.modelActiveKey)
      emit('syncData')
    } else {
      message.success('已是最新数据')
    }
  }
}
//打开弹窗
const openModel = (value: any) => {
  activeKey.value = value
  visible.value = true
}
//处理方式弹窗
const handleOk = () => {
  console.log(activeKey.value)
  confirmLoading.value = true
  setTimeout(() => {
    confirmLoading.value = false
    visible.value = false
  }, 1000)
  emit('handleOk', activeKey.value)
}
const handleCancel = () => {
  visible.value = false
}
const handleSelect = (key: string) => {
  activeKey.value = key
}
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
</style>
