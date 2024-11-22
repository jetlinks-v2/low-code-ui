<template>
  <div className="filter-module-center" ref="filterModuleRef">
    <img class="modal-config-img" :src="getImage('/list-page/filter.png')" v-if="open">
    <j-drawer
      title="筛选模块配置"
      placement="right"
      width="560px"
      :closable="true"
      :visible="open"
      :getContainer="() => $refs.filterModuleRef"
      :wrap-style="{ position: 'absolute', zIndex: 1, overflow: 'hidden' }"
      :destroyOnClose="true"
      @close="emits('update:open', false)"
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
        tableType="filter"
        v-model:asyncData="dataBinds.filterAsync"
        :errorList="errorList"
        :bindData="dataBinds.filterBind"
        :bind-function-id="dataBinds.data.function"
        @handleAdd="handleAdd"
        @configuration="configuration"
        @handleOk="handleOk"
        @bindData="bindData"
        @handleChange="(data) => dataSource = data"
        @update-bind="(data) => dataBinds.filterBind = data"
      />
      <div v-if="type !== ''">
        <a-page-header title=" " @back="goBack">
          <template #backIcon>
            <AIcon type="LeftOutlined" />
            返回
          </template>
        </a-page-header>
        <EnumType
          v-if="type === 'enum'"
          :id="props.id"
          :data="configRow"
          :errorList="errorList"
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
        <j-space>
          <j-button @click="goBack">
            取消
          </j-button>
          <j-button type="primary" @click="submit">
            确定
          </j-button>
        </j-space>
      </template>
    </j-drawer>
  </div>
</template>

<script lang="ts" setup>
import Table from '@LowCode/components/ListPage/FilterModule/components/FilterTable.vue'
import {
  EnumType,
  StringType,
  NumberType,
  DateType,
} from '@LowCode/components/ListPage/FilterModule/components/index'
import { getImage, randomString } from '@jetlinks-web/utils';

import { validFilterModule } from './utils/valid'
import { DATA_BIND } from '../keys'
import { cloneDeep } from 'lodash-es';

interface Emit {
  (e: 'update:open', value: boolean): void
  (e: 'update:dataSource', value: any): void
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
  dataSource: {
    type: Array,
    default: () => []
  }
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
const subValue = ref({})
const show = ref(false)
//是否完成数据绑定
const dataBind = ref(false)
//是否同步数据
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
    width: 140,
    type: 'text',
    form: {
      isVerify: true,
      required: true,
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
    width: 140,
    type: 'text',
    form: {
      isVerify: true,
      required: true,
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
    width: 110,
    tips: true,
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    ellipsis: true,
    align: 'center',
    width: 100,
  },
]

const dataBinds: any = inject(DATA_BIND)
//数据
const dataSource = computed({
  get() {
    return props.dataSource
  },
  set(val) {
    emits('update:dataSource', val)
  }
})
//新增一列table
const handleAdd = async (table: any) => {
  table?.addItem({
    id: '',
    name: '',
    type: 'string',
    mark: 'add',
    rowKey: randomString(8)
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
  switch (value) {
    case '1':
      dataSource.value = data
      break
    case '2':
      console.log(...data);
      dataSource.value.push(...data)
      // if (configChange.value) {
      //   data?.map((item: any) => {
      //     const dataFind = dataSource.value?.find(
      //       (i: any) => i?.id === item?.id,
      //     )
      //     if (dataFind?.config !== item?.config) {
      //       dataSource.value.push(item)
      //     }
      //   })
      // } else {
      //   data?.map((item: any) => {
      //     if (item?.mark === 'add') {
      //       dataSource.value.push(item)
      //     }
      //   })
      // }
      break
    case '3':
      break
  }
  configChange.value = false
}
//点击显示table的同步数据
const bindData = (data: any) => {
  dataSource.value = data;
}
//保存
const submit = () => {
  const dataRow = dataSource.value?.find(
    (item: any) => item?.id === configRow.value?.id,
  )
  if (dataRow) {
    dataRow['config'] = { ...subValue.value }
  }

  type.value = ''
  show.value = true
  dataBind.value = true
  dataBinds.filterAsync = true
  configChange.value = true
}
const goBack = () => {
  type.value = ''
  show.value = true
  dataBind.value = true
  dataBinds.filterAsync = true
  configChange.value = false
}
/**
 * 校验筛选模块配置
 */
const errorList: any = ref([])
const valid = async () => {
  return new Promise((resolve) => {
    validFilterModule(dataSource.value).then(res => {
      errorList.value = res;
      if(errorList.value.length) {
        resolve([{message: '筛选项配置错误'}])
      } else {
        resolve([])
      }
    })
  })
  // return new Promise((resolve, reject) => {
  //   errorList.value = validFilterModule(dataSource.value)
  //   if (errorList.value.length) reject([{message: '数据绑定配置错误'}])
  //   else resolve([])
  // })
}

defineExpose({
  valid,
  errorList,
})

// watch(
//   () => dataBinds,
//   () => {
//     if (dataBinds.data.function) {
//       dataBind.value = true
//     } else {
//       dataBind.value = false
//       dataSource.value = [];
//     }
//   },
//   { immediate: true, deep: true },
// )

</script>

<style scoped lang="less"></style>
