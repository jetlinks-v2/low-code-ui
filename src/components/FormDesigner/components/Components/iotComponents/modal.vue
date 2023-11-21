<template>
  <j-modal
    title="名称"
    visible
    @cancel="closeModal"
    :width="1000"
    @ok="submitData"
    :destroyOnClose="true"
    :maskClosable="false"
  >
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
      rowKey="id"
      :params="params"
      :gridColumn="2"
      :gridColumns="[2]"
      :rowSelection="{
        selectedRowKeys: map(_selectedRowKeys, 'id'),
        onSelect: onSelectChange,
        onSelectNone: onSelectNone,
        onSelectAll: onAllSelect,
        type: mode === 'multiple' ? 'checkbox' : 'radio',
      }"
      class="table"
    >
      <template #card="slotProps">
        <Card
          :status="
            type === 'product' ? slotProps.state : slotProps.state?.value
          "
          :active="map(_selectedRowKeys, 'id').includes(slotProps.id)"
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
          :status="
            type === 'product' ? slotProps.state : slotProps.state?.value
          "
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
  </j-modal>
</template>

<script lang="ts" setup>
import { queryProductList, queryDeviceList } from '@/api/form'
import { map } from 'lodash-es'
import { inject, ref, watch } from 'vue'
const props = defineProps({
  select: {
    type: Array,
    default: () => [],
  },
})
const type = inject('type')
const mode = inject('mode')
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
    title: type === 'product' ? '产品名称' : '设备名称',
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
        type === 'product'
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
const _selectedRowKeys:any = ref<any[]>([])
const emit = defineEmits(['close', 'save'])

const params = ref()

const handleSearch = (i: any) => {
  params.value = i
}

const onSelectChange = (row: any) => {
  if (mode !== 'multiple') {
    _selectedRowKeys.value = [row]
  } else {
    const index = _selectedRowKeys.value.findIndex((item) => row.id === item.id)
    if (index === -1) {
      _selectedRowKeys.value.push(row)
    } else {
      _selectedRowKeys.value.splice(index, 1)
    }
  }
}

const onSelectNone = () => {
  _selectedRowKeys.value = []
}

const onAllSelect = (selected: Boolean, selectedRows: any, changeRows: any) => {
  if (selected) {
    const _arr = map(_selectedRowKeys.value, 'id')
    changeRows.map((i: any) => {
      if (!_arr.includes(i.id)) {
        _selectedRowKeys.value.push(i)
      }
    })
  } else {
    const arr = changeRows.map((item: any) => item.id)
    const _ids: any[] = []
    _selectedRowKeys.value.map((i: any) => {
      if (!arr.includes(i.id)) {
        _ids.push(i)
      }
    })
    _selectedRowKeys.value = _ids
  }
}
const closeModal = () => {
  emit('close')
}

const submitData = () => {
  emit('save', _selectedRowKeys.value)
}

watch(
  () => props.select,
  () => {
    _selectedRowKeys.value = props?.select || []
  },
  {
    deep: true,
  },
)
</script>
<style lang="less" scoped>
.table {
  height: 400px;
  overflow: auto;
  // min-height: auto;
}
.productImg {
  height: 100px;
}
</style>
