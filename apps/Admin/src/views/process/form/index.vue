<template>
  <page-container>
    <pro-search
      :columns="columns"
      target="engine-form"
      @search="handleSearch"
    />
    <JProTable
      ref="tableRef"
      :columns="columns"
      :params="params"
      model="TABLE"
      :request="_query"
      :defaultParams="{
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [
          {
            value: true,
            termType: 'eq',
            type: 'and',
            column: 'latest',
          },
        ],
      }"
    >
      <template #headerTitle>
        <PermissionButton
          @click="handleAdd()"
          type="primary"
          hasPermission="workflow/form:add"
        >
          新增
        </PermissionButton>
      </template>
      <template #createTime="slotProps">
        <span>{{
          slotProps?.createTime
            ? dayjs(slotProps.createTime).format('YYYY-MM-DD HH:mm:ss')
            : ''
        }}</span>
      </template>
      <template #modifyTime="slotProps">
        <span>{{
          slotProps?.modifyTime
            ? dayjs(slotProps.modifyTime).format('YYYY-MM-DD HH:mm:ss')
            : ''
        }}</span>
      </template>
      <template #action="slotProps">
        <j-space>
          <template v-for="i in getActions(slotProps)" :key="i?.key">
            <PermissionButton
              :popConfirm="i?.popConfirm"
              :tooltip="i?.tooltip"
              @click="i?.onClick"
              type="link"
              style="padding: 0 5px"
              :danger="i?.key === 'delete'"
              :hasPermission="i?.key === 'view' ? false : `workflow/form:${i?.hasPermission}`"
            >
              <template #icon><AIcon :type="i.icon" /></template>
            </PermissionButton>
          </template>
        </j-space>
      </template>
    </JProTable>
    <Save
      v-if="visible"
      @save="handleSave"
      @close="handleClose"
      :data="current"
    />
  </page-container>
</template>

<script lang="ts" setup>
import Save from './Save/index.vue'
import dayjs from 'dayjs'
import { _query, _delete } from '@/api/process/form'
import { onlyMessage } from '@/utils/comm'
import { router } from '@jetlinks/router'
import { ref } from 'vue'

const params = ref<any>({})
const tableRef = ref<Record<string, any>>({})
const current = ref({})
const visible = ref<boolean>(false)

const columns = [
  {
    title: '表单标识',
    dataIndex: 'key',
    key: 'key',
    ellipsis: true,
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入表单标识',
      },
    },
  },
  {
    title: '表单名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入表单名称',
      },
    },
  },
  {
    title: '说明',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    scopedSlots: true,
  },
  {
    title: '创建人',
    dataIndex: 'creatorName',
    key: 'creatorName',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'date',
    },
  },
  {
    title: '最近修改时间',
    dataIndex: 'modifyTime',
    key: 'modifyTime',
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'date',
    },
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: true,
  },
]

const getActions = (record) => {
  return [
    {
      key: 'view',
      text: '查看',
      tooltip: {
        title: '查看',
      },
      icon: 'EyeOutlined',
      onClick: () => {
        router.replace(`/flow-engine/form/detail/${record?.id}`)
      },
    },
    {
      key: 'edit',
      text: '编辑',
      tooltip: {
        title: '编辑',
      },
      icon: 'EditOutlined',
      hasPermission: "update",
      onClick: () => {
        handleAdd(record)
      },
    },
    {
      key: 'delete',
      text: '删除',
      tooltip: {
        title: '删除',
      },
      icon: 'DeleteOutlined',
      hasPermission: "delete",
      popConfirm: {
        title: '确认删除？',
        onConfirm: () => {
          _del(record.key)
        },
      },
    },
  ]
}

const handleSearch = (data: any) => {
  params.value = {
    terms: [{ ...data }],
  }
}

const handleAdd = (data?: any) => {
  visible.value = true
  current.value = data
}

const handleSave = () => {
  visible.value = false
  tableRef.value?.reload()
}

const handleClose = () => {
  visible.value = false
}

const _del = async (id: string) => {
  const res = await _delete(id)
  if (res.status === 200) {
    onlyMessage('操作成功')
    tableRef.value?.reload()
  }
}
</script>

<style scoped lang="less">
</style>
