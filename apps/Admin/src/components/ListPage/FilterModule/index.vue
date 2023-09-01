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
        v-if="type === ''"
        :columns="columns"
        :dataBind="dataBind"
        :dataChange="dataChange"
        :title="title"
        :addBtnName="addBtnName"
        :dataSource="dataSource"
        :modelActiveKey="activeKey"
        :show="show"
        :asyncData="asyncData"
        :configChange="configChange"
        :errorList="errorList"
        @handleAdd="handleAdd"
        @configuration="configuration"
        @handleOk="handleOk"
        @bindData="bindData"
      />
      <div v-if="type !== ''">
        <a-page-header title="配置筛选项" sub-title="配置筛选项" @back="goBack">
          <template #backIcon>
            <AIcon type="LeftOutlined" />
            返回
          </template>
        </a-page-header>
        <EnumType
          v-if="type === 'enum'"
          :id="props.id"
          :data="configRow"
          @update:state="(newValue) => (subValue = newValue)"
        />
        <StringType
          v-if="type === 'string'"
          :id="props.id"
          :data="configRow"
          @update:state="(newValue) => (subValue = newValue)"
        />
        <NumberType
          v-if="type === 'number'"
          :id="props.id"
          :data="configRow"
          @update:state="(newValue) => (subValue = newValue)"
        />
        <DateType
          v-if="type === 'date'"
          :id="props.id"
          :data="configRow"
          @update:state="(newValue) => (subValue = newValue)"
        />
      </div>

      <template #footer v-if="type !== ''">
        <j-button style="float: right" type="primary" @click="submit">
          确定
        </j-button>
        <j-button style="float: right; margin-right: 8px" @click="goBack">
          取消
        </j-button>
      </template>
    </j-drawer>
  </div>
</template>

<script lang="ts" setup>
import Table from '@/components/ListPage/FilterModule/components/FilterTable.vue'
import {
  EnumType,
  StringType,
  NumberType,
  DateType,
} from '@/components/ListPage/FilterModule/components/index'

import { useAllListDataStore } from '@/store/listForm'
import { validFilterModule } from './utils/valid'
import { DATA_BIND } from '../keys'

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
const show = ref(false)
//是否完成数据绑定
const dataBind = ref(false)
//是否同步数据
const asyncData = ref(false)
//数据是否有变动
const dataChange = ref(false)
//是否修改配置
const configChange = ref(false)
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
          validator(data: any, value: any) {
            if (!value) {
              return Promise.reject('请输入标识')
            } else {
              const addId = data?.field.split('.')
              if (Number(addId[1])) {
                const same = dataSource.value?.findIndex(
                  (i: any) => i?.id === value,
                )
                if (
                  same !== -1 &&
                  Number(addId[1]) > dataSource.value?.length - 1
                ) {
                  return Promise.reject('标识重复，请重新输入！')
                }
              }
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
      required: true,
      rules: [
        {
          validator(_, value) {
            if (!value) {
              return Promise.reject('请输入名称')
            }
            return Promise.resolve()
          },
        },
      ],
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

const dataBinds: any = inject(DATA_BIND)
//数据
const dataSource = ref([])
//新增一列table
const handleAdd = async (table: any) => {
  table?.addItem({
    id: '',
    name: '',
    type: 'string',
    mark: 'add',
  })
}

const configRow = ref()
//配置
const configuration = (data: any, value: any) => {
  type.value = data?.record?.type
  configRow.value = data?.record
  dataSource.value = value
}
//处理方式弹窗
const handleOk = (value: any, data: any) => {
  activeKey.value = value
  let source: any = []
  switch (value) {
    case '1':
      if (configChange.value) {
        data?.map((item: any) => {
          const dataFind = dataSource.value?.find(
            (i: any) => i?.id === item?.id,
          )
          if (dataFind?.config !== item?.config) {
            source.push(item)
          }
        })
      } else {
        data?.map((item: any) => {
          if (item?.mark === 'add') {
            source.push(item)
          }
        })
      }
      break
    case '2':
      source = data
      break
    case '3':
      source = dataBinds?.functionInfo?.configuration?.columns?.map((item) => {
        return {
          id: item.name,
          name: item.name,
          type: 'string',
        }
      })
      break
  }
  dataSource.value = source
  configChange.value = false
  configurationStore.setALLlistDataInfo(
    'searchData',
    dataSource.value,
    props.id,
  )
}
//点击显示table的同步数据
const bindData = (data: any) => {
  configurationStore.setALLlistDataInfo('datasource', data, props.id)
}
//保存
const submit = () => {
  configurationStore.setALLlistDataInfo(type.value, subValue.value, props.id)
  const dataRow = dataSource.value?.find(
    (item: any) => item?.id === configRow.value?.id,
  )
  if (dataRow) {
    dataRow['config'] = { ...subValue.value }
  }

  type.value = ''
  show.value = true
  dataBind.value = true
  asyncData.value = true
  configChange.value = true
}
const goBack = () => {
  type.value = ''
  show.value = true
  dataBind.value = true
  asyncData.value = true
}
/**
 * 校验筛选模块配置
 */
const errorList: any = ref([])
const valid = () => {
  return new Promise((resolve, reject) => {
    errorList.value = validFilterModule(dataSource.value)
    if (errorList.value.length) reject(errorList.value)
    else resolve([])
  })
}

defineExpose({
  valid,
  errorList,
})

watch(
  () => dataBinds,
  () => {
    if (dataBinds.functionInfo) {
      dataBind.value = true
    } else {
      dataBind.value = false
    }
    dataSource.value = dataBinds?.functionInfo?.configuration?.columns?.map(
      (item) => {
        return {
          id: item.name,
          name: item.name,
          type: 'string',
        }
      },
    )
  },
  { immediate: true, deep: true },
)
</script>

<style scoped lang="less"></style>
