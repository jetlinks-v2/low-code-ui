<template>
  <div className="filter-module-center">
    <j-drawer
      title="配置"
      placement="bottom"
      :closable="true"
      :visible="open"
      @close="emits('update:open', false)"
      height="520px"
    >
      <Table
        :columns="columns"
        :dataBind="dataBind"
        :asynData="asynData"
        :dataChange="dataChange"
        :title="title"
        :addBtnName="addBtnName"
        :dataSource="dataSource"
        :modelActiveKey="activeKey"
        @handleAdd="handleAdd"
        @configuration="configuration"
        @confirm="confirm"
        @handleOk="handleOk"
        v-if="type === ''"
      />
      <div v-else>
        <a-page-header
          title="配置筛选项"
          sub-title="配置筛选项"
          @back="type = ''"
        >
          <template #backIcon>
            <AIcon type="LeftOutlined" />
            返回
          </template>
        </a-page-header>
        <EnumType v-if="type === 'enum'" @update:state="newValue => subValue = newValue"/>
        <StringType v-if="type === 'string'" @update:state="newValue => subValue = newValue"/>
        <NumberType v-if="type === 'number'" @update:state="newValue => subValue = newValue"/>
        <DateType v-if="type === 'date'" @update:state="newValue => subValue = newValue"/>
      </div>

      <template #footer v-if="type !== ''">
        <j-button style="float: right" type="primary" @click="submit">
          确定
        </j-button>
        <j-button style="float: right; margin-right: 8px" @click="type = ''">
          取消
        </j-button>
      </template>
    </j-drawer>
  </div>
</template>

<script lang="ts" setup>
import Table from '@/components/ListPage/FilterModule/components/FilterTable.vue'
import EnumType from '@/components/ListPage/FilterModule/components/EnumType.vue'
import StringType from '@/components/ListPage/FilterModule/components/StringType.vue'
import NumberType from '@/components/ListPage/FilterModule/components/NumberType.vue'
import DateType from '@/components/ListPage/FilterModule/components/DateType.vue'
import { useFilterModuleStore } from '@/store/filterModule'

interface Emit {
  (e: 'update:open', value: boolean): void
}

const emits = defineEmits<Emit>()
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const open = computed({
  get() {
    return props.open
  },
  set(val: boolean) {
    emits('update:open', val)
  },
})
const type = ref('')
const title = ref('请选择页面支持的筛选项')
const addBtnName = ref('新增筛选项')
const configurationStore = useFilterModuleStore()
const subValue =ref({})
//是否完成数据绑定
const dataBind = ref(true)
//是否同步数据绑定
const asynData = ref(true)
//数据是否有变动
const dataChange = ref(true)
//处理方式弹窗activeKey
const activeKey = ref('1')
//筛选类型
const options = [
  {
    value: 'string',
    label: 'string',
  },
  {
    value: 'enum',
    label: 'enum',
  },
  {
    value: 'date',
    label: 'date',
  },
  {
    value: 'number',
    label: 'number',
  },
]
const columns: any = [
  {
    title: '标识',
    dataIndex: 'id',
    key: 'id',
    ellipsis: true,
    align: 'center',
    width: 150,
    type: 'text',
    form: {
      isVerify: true,
      required: true,
      rules: [
        {
          validator(_, value) {
            if (!value) {
              return Promise.reject('请输入标识')
            }
            return Promise.resolve()
          },
        },
      ],
    },
    doubleClick(record) {
      return record?.mark === 'add'
    },
  },
  {
    title: '筛选项名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    align: 'center',
    width: 150,
    type: 'text',
    form: {
      isVerify: true,
      required: false,
    },
  },
  {
    title: '筛选项类型',
    dataIndex: 'type',
    key: 'type',
    ellipsis: true,
    align: 'center',
    type: 'select',
    options: options,
    width: 150,
    tips: true,
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    ellipsis: true,
    align: 'center',
    width: 140,
  },
]
//数据
const dataSource = ref([
  {
    id: 'deviceId1',
    name: 'date类型',
    type: 'date',
  },
  {
    id: 'deviceId2',
    name: '枚举类型',
    type: 'enum',
  },
  {
    id: 'deviceId3',
    name: '数字类型',
    type: 'number',
  },
  {
    id: 'deviceId4',
    name: '字符串类型',
    type: 'string',
  },
])
//新增一列table
const handleAdd = async (table: any) => {
  table.addItem({
    id: '',
    name: '',
    type: 'string',
    mark: 'add',
  })
}
//删除
const confirm = (data: any) => {
  console.log(data, 'confirm')
}
const configRow = ref()
//配置
const configuration = (data: any) => {
  type.value = data?.record?.type
  configRow.value = data?.record
}
//处理方式弹窗
const handleOk = (value: any) => {
  activeKey.value = value
}

//保存
const submit = () => {
  configurationStore.setConfigurationInfo(subValue.value,type.value)
  const dataRow = dataSource.value?.find(
    (item: any) => item?.id === configRow.value?.id,
  )
  if (dataRow) {
    dataRow.config = { ...subValue.value }
  }
  configurationStore.setData(dataSource.value)
  type.value = ''
}
watch(
  () => dataSource.value,
  () => {
    configurationStore.setData(dataSource.value)
  },
)
</script>

<style scoped lang="less"></style>
