<template>
  <pro-search
    type="simple"
    :columns="columns"
    @search="handleSearch"
  ></pro-search>
  <JProTable
    :columns="columns"
    :request="type === 'product' ? queryProductList : queryDeviceList"
    ref="tableRef"
    :defaultParams="{
      sorts: [{ name: 'createTime', order: 'desc' }],
    }"
    :scroll="{ y: 300 }"
    rowKey="id"
    :params="params"
    :gridColumn="2"
    :gridColumns="[2]"
    :rowSelection="{
      selectedRowKeys: _selectedRowKeys,
      onSelect: onSelectChange,
      onSelectNone: onSelectNone,
      onSelectAll: onAllSelect,
    }"
    class="table"
  >
    <template #card="slotProps">
      <Card
        :status="type === 'product' ? slotProps.state : slotProps.state?.value"
        :active="_selectedRowKeys.includes(slotProps.id)"
        @click="() => onSelectChange(slotProps)"
        :statusText="
          type === 'product'
            ? slotProps.state === 1
              ? '正常'
              : '禁用'
            : slotProps.state?.text
        "
        :statusNames="
          type === 'product'
            ? { 1: 'processing', 0: 'error' }
            : {
                online: 'processing',
                offline: 'error',
                notActive: 'warning',
              }
        "
      >
        <template #img>
          <slot name="img">
            <img
              :src="
                slotProps.photoUrl || '/images/form-designer/device-card.png'
              "
              class="productImg"
            />
          </slot>
        </template>
        <template #content>
          <j-ellipsis style="width: calc(100% - 100px); margin-bottom: 18px"
            ><span style="font-weight: 600; font-size: 16px">
              {{ slotProps.name }}
            </span></j-ellipsis
          >
          <j-row>
            <j-col>
              <div class="card-item-content-text">ID</div>
              <div>{{ slotProps?.id }}</div>
            </j-col>
          </j-row>
        </template>
      </Card>
    </template>
    <template #state="slotProps">
      <BadgeStatus
        :text="
          type === 'product'
            ? slotProps.state === 1
              ? '正常'
              : '禁用'
            : slotProps.state?.text
        "
        :status="type === 'product' ? slotProps.state : slotProps.state?.value"
        :statusNames="
          type === 'product'
            ? {
                1: 'processing',
                0: 'error',
              }
            : {
                online: 'processing',
                offline: 'error',
                notActive: 'warning',
              }
        "
      />
    </template>
  </JProTable>
</template>
<script setup lang="ts">
import { queryProductList, queryDeviceList } from '@LowCode/api/form'
import { cloneDeep } from 'lodash-es';
import { Search as ProSearch, Card , BadgeStatus} from '@LowCode/components/index'
const props = defineProps({
  type: {
    type: String,
    default: 'product',
  },
  dataSource: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => []
  }
})
const emits = defineEmits(['updateData'])
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    scopedSlots: true,
    width: 200,
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: props.type === 'product' ? '产品名称' : '设备名称',
    dataIndex: 'name',
    key: 'name',
    width: 220,
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    scopedSlots: true,
    ellipsis: true,
    width: 90,
    search: {
      type: 'select',
      options:
        props.type === 'product'
          ? [
              {
                label: '正常',
                value: 1,
              },
              {
                label: '禁用',
                value: 0,
              },
            ]
          : [
              { label: '禁用', value: 'notActive' },
              { label: '离线', value: 'offline' },
              { label: '在线', value: 'online' },
            ],
    },
  },
]

const params = ref()
const _selectedRowKeys = ref<any[]>([])
const _selectedRows = ref<any[]>([])

const onSelectChange = (row: any) => {
  const arr = new Set(_selectedRowKeys.value)
  const index = _selectedRowKeys.value.indexOf(row.id)
  if (index === -1) {
    arr.add(row.id)
    _selectedRows.value.push(row)
  } else {
    arr.delete(row.id)
    _selectedRows.value.splice(index, 1)
  }
  _selectedRowKeys.value = [...arr.values()]
}

const onSelectNone = () => {
  _selectedRowKeys.value = []
  _selectedRows.value = []
}

const onAllSelect = (selected: Boolean, selectedRows: any, changeRows: any) => {
  if (selected) {
    changeRows.map((i: any) => {
      if (!_selectedRowKeys.value.includes(i.id)) {
        _selectedRowKeys.value.push(i.id)
        _selectedRows.value.push(i)
      }
    })
  } else {
    const arr = changeRows.map((item: any) => item.id)
    const _ids: string[] = []
    const _rows: any[] = []
    _selectedRowKeys.value.map((i: any) => {
      if (!arr.includes(i)) {
        _ids.push(i.id)
        _rows.push(i)
      }
    })
    _selectedRowKeys.value = _ids
    _selectedRows.value = _rows
  }
}

const handleSearch = (i: any) => {
  params.value = i
}

watchEffect(() => {
  _selectedRows.value = cloneDeep(props.dataSource)
  _selectedRowKeys.value = props.dataSource.map(item => item.id)
})

defineExpose({
  _selectedRowKeys,
  _selectedRows
})
</script>
<style scoped lang="less">
:deep(.JSearch-warp) {
  margin-bottom: 0px !important;
}
</style>
