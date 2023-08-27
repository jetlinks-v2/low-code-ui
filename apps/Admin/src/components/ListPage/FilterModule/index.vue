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
        :errorList="errorList"
        @handleAdd="handleAdd"
        @configuration="configuration"
        @confirm="confirm"
        @handleOk="handleOk"
        @handleChange="(data) => dataSource = data"
        v-if="type === ''"
      />
      <div v-if="type !== ''">
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
        <EnumType
          v-if="type === 'enum'"
          @update:state="(newValue) => (subValue = newValue)"
          :id="props.id"
        />
        <StringType
          v-if="type === 'string'"
          @update:state="(newValue) => (subValue = newValue)"
          :id="props.id"
        />
        <NumberType
          v-if="type === 'number'"
          @update:state="(newValue) => (subValue = newValue)"
          :id="props.id"
        />
        <DateType
          v-if="type === 'date'"
          @update:state="(newValue) => (subValue = newValue)"
          :id="props.id"
        />
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
import { useAllListDataStore } from '@/store/listForm'
import { validFilterModule } from './utils/valid'

interface Emit {
  (e: 'update:open', value: boolean): void
}

const emits = defineEmits<Emit>()
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  id: {
    type: null,
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
const configurationStore = useAllListDataStore()
const subValue = ref({})
//是否完成数据绑定
const dataBind = ref(false)
//是否同步数据绑定
const asynData = ref(true)
//数据是否有变动
const dataChange = ref(false)
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

const dataBinds: any = inject('dataBind')
//数据
const dataSource = ref([])
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
  configurationStore.setALLlistDataInfo(type.value, subValue.value, props.id)
  console.log(type.value, subValue.value, props.id)
  const dataRow = dataSource.value?.find(
    (item: any) => item?.id === configRow.value?.id,
  )
  if (dataRow) {
    dataRow['config'] = { ...subValue.value }
  }
  configurationStore.setALLlistDataInfo(
    'searchData',
    dataSource.value,
    props.id,
  )
  type.value = ''
}

/**
 * 校验筛选模块配置
 */
const errorList:any = ref([])
const valid = async () => {
  errorList.value = await validFilterModule(dataSource.value)
}

defineExpose({
  valid,
  errorList,
})
watch(
  () => dataSource.value,
  () => {
    configurationStore.setALLlistDataInfo(
      'searchData',
      dataSource.value,
      props.id,
    )
  },
)

watch(
  () => dataBinds,
  () => {
    if(dataBinds.functionInfo) {
      dataBind.value = true;
    } else {
      dataBind.value = false
    }
    dataSource.value = dataBinds?.functionInfo?.configuration?.columns?.map(item => {
      return {
        id: item.name,
        name: item.name,
        type: 'string'
      }
    })
  },
  { immediate: true, deep: true },
)
</script>

<style scoped lang="less"></style>
