<!-- 流程监控 -->
<template>
  <page-container>
    <div class="tab">
      <j-radio-group v-model:value="history" button-style="solid">
        <j-space>
          <j-radio-button :value="false">流转中</j-radio-button>
          <j-radio-button :value="true">已完成</j-radio-button>
        </j-space>
      </j-radio-group>
    </div>
    <pro-search :columns="columns" target="code" @search="handleSearch" />
    <JProTable
      ref="tableRef"
      model="table"
      :columns="columns"
      :params="{
        history,
        ...params,
      }"
      :request="getList_api"
      :defaultParams="{
        sorts: [{ name: 'createTime', order: 'desc' }],
      }"
    >
      <template #classifiedId="{ classifiedId }">
        {{ classifiedStore.getText(classifiedId) }}
      </template>
      <template #state="{ state }">
        <!-- <BadgeStatus
          :status="state.value"
          :text="state.text"
          :statusNames="{
            undeployed: 'error',
            running: 'running',
          }"
        /> -->
        {{ state.text }}
      </template>
      <template #createTime="{ createTime }">
        {{ dayjs(createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template #endTime="{ endTime }">
        {{ endTime && dayjs(endTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      

      <template #action="slotProps">
        <PermissionButton
          type="link"
          :tooltip="{
            title: '详情',
          }"
          @click="handleDetail(slotProps)"
        >
          <AIcon type="EyeOutlined" />
        </PermissionButton>
        <PermissionButton
          :hasPermission="false"
          type="link"
          danger
          :tooltip="{
            title: '关闭',
          }"
          :popConfirm="{
            title: `确认关闭该流程？`,
            onConfirm: () => handleDel(slotProps.id),
          }"
        >
          <AIcon type="CloseCircleOutlined" />
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
import Drawer from './Drawer/index.vue'
import { getList_api } from '@/api/process/monitor'
import dayjs from 'dayjs'
import { useClassified } from '@/store'

const classifiedStore = useClassified()
const history = ref(false)
const columns = [
  {
    title: '流程分类',
    dataIndex: 'classifiedId',
    key: 'classifiedId',
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'select',
      componentProps: {
        placeholder: '请选择流程分类',
      },
      options: classifiedStore.classified,
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
  },
  {
    title: '摘要',
    dataIndex: 'summary',
    key: 'summary',
    ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'select',
      componentProps: {
        placeholder: '请选择状态',
      },
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
      type: 'select',
      componentProps: {
        placeholder: '请输入发起人',
      },
      options: async () => {
        const resp = await getList_api({
          paging: false,
          sorts: [{ name: 'createTime', order: 'desc' }],
        })
        const listMap = new Map()
        if (resp.status === 200) {
          resp.result.data.forEach((item) => {
            listMap.set(item.creatorId, {
              label: item.creatorName,
              value: item.creatorId,
            })
          })
          return [...listMap.values()]
        }
        return []
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
    dataIndex: 'endTime',
    key: 'endTime',
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
<style scoped lang="less">
.tab {
  height: 48px;
  border-bottom: 1px solid #d9d9d9;
  padding: 10px 16px;
  background: #ffffff;
  :deep(.ant-radio-button-wrapper) {
    border-radius: 4px;
    border: none;
    &:hover {
      color: #315efb;
      background: #e4eaff;
      border: none;
    }
  }
  :deep(.ant-radio-button-wrapper-checked) {
    color: #315efb;
    background: #e4eaff;
    border: none;
  }
}
</style>
