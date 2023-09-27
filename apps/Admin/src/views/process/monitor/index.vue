<!-- 流程监控 -->
<template>
  <page-container>
    <pro-search :columns="columns" target="code" @search="handleSearch" />
    <JProTable
      ref="tableRef"
      model="table"
      :columns="columns"
      :params="params"
      :request="getList_api"
      :defaultParams="{
        sorts: [{ name: 'createTime', order: 'desc' }],
      }"
    >
      <template #createTime="{ createTime }">
        {{ dayjs(createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>

      <template #action="slotProps">
        <PermissionButton
          type="link"
          :tooltip="{
            title: '详情',
          }"
          @click="handleDetail(slotProps)"
        >
          详情
        </PermissionButton>
        <PermissionButton
          :hasPermission="false"
          type="link"
          danger
          :tooltip="{
            title: '关闭',
          }"
          :popConfirm="{
            title: `确认关闭？`,
            onConfirm: () => handleDel(slotProps.id),
          }"
        >
          关闭
        </PermissionButton>
      </template>
    </JProTable>
    <Drawer
      v-if="drawer.visible"
      v-model:visible="drawer.visible"
      :data="drawer.selectItem"
      :showRecords="true"
    />
  </page-container>
</template>
<script setup>
import Drawer from '../components/Drawer/index.vue'
import { getList_api } from '@/api/process/instance'
import dayjs from 'dayjs'

const columns = [
  {
    title: '流程分类',
    dataIndex: 'provider',
    key: 'provider',
    ellipsis: true,
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入流程分类',
      },
    },
  },
  {
    title: '流程名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入流程名称',
      },
    },
  },
  {
    title: '标题',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入流程名称',
      },
    },
  },
  {
    title: '摘要',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入流程名称',
      },
    },
  },
  {
    title: '状态',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'select',
      options: [
        { label: '启用', value: 'enabled' },
        { label: '禁用', value: 'disabled' },
      ],
    },
  },
  {
    title: '发起人',
    dataIndex: 'creatorName',
    key: 'creatorName',
    ellipsis: true,
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入发起人',
      },
    },
  },
  {
    title: '发起时间',
    dataIndex: 'createTime',
    key: 'createTime',
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'date',
    },
  },
  {
    title: '结束时间',
    dataIndex: 'createTime',
    key: 'createTime',
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

const params = ref({})

// 抽屉
const drawer = reactive({
  selectItem: {},
  visible: false,
})

const handleSearch = (data) => {
  params.value = data
}

// 关闭
const handleDel = (id) => {}

// 详情
const handleDetail = (row) => {
  drawer.selectItem = { ...row }
  drawer.visible = true
}
</script>
<style scoped lang="less"></style>
