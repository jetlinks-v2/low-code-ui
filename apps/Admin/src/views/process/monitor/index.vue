<!-- 流程监控 -->
<template>
  <page-container>
    <div class="tabs">
      <j-tabs v-model:activeKey="history" @change="change">
        <j-tab-pane :key="false">
          <template #tab>
            <div class="tab-item" :class="{ active: !history }">流转中</div>
          </template>
          <pro-search
            :columns="columns"
            target="monitor-false"
            @search="handleSearch"
          />
        </j-tab-pane>
        <j-tab-pane :key="true">
          <template #tab>
            <div class="tab-item" :class="{ active: history }">已完成</div>
          </template>
          <pro-search
            :columns="columns"
            target="monitor-true"
            @search="handleSearch"
          />
        </j-tab-pane>
      </j-tabs>
    </div>
    <JProTable
      ref="tableRef"
      model="table"
      :columns="columns"
      :params="tableParams"
      :request="getList_api"
      :defaultParams="{
        sorts: [{ name: 'deployTime', order: 'desc' }],
        terms: history
          ? []
          : [
              {
                type: 'and',
                value: 'running',
                termType: 'eq',
                column: 'state',
              },
            ],
      }"
    >
      <template #headerTitle>
        <j-space>
          <PermissionButton
            type="primary"
            @click="handleTurn"
            hasPermission="process/model:add"
          >
            转办</PermissionButton
          >
          <div>
            <AIcon type="ExclamationCircleOutlined" />
            <span
              >原定节点办理人无法完成审办工作时，转办可将处于“流转中”状态的流程指派给其他成员。</span
            >
          </div>
        </j-space>
      </template>
      <template #state="{ state }">
        {{ state.text }}
      </template>
      <template #deployTime="{ deployTime }">
        {{ dayjs(deployTime).format('YYYY-MM-DD HH:mm:ss') }}
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
          v-if="!history"
          :hasPermission="false"
          type="link"
          danger
          :tooltip="{
            title: '关闭',
          }"
          :popConfirm="{
            title: `确认关闭该流程？`,
            onConfirm: () => handleClose(slotProps.id),
          }"
        >
          <AIcon type="CloseCircleOutlined" />
        </PermissionButton>
      </template>
    </JProTable>
    <Dialog
      v-if="dialog.visible"
      v-model:visible="dialog.visible"
      @refresh="refresh"
    />
    <Drawer
      v-if="drawer.visible"
      type="card"
      @close="drawer.visible = false"
      :current="drawer.selectItem"
      :history="history"
    />
  </page-container>
</template>
<script setup>
import { onlyMessage } from '@jetlinks/utils'
import Dialog from './Dialog/index.vue'
import { getList_api, getAllList_api, close_api } from '@/api/process/monitor'
import dayjs from 'dayjs'
import { providerEnum } from '@/api/process/model'
import Drawer from '@/views/process/me/Detail/index.vue'

const tableRef = ref()
const history = ref(false)
const defaultColumns = [
  {
    title: '流程分类',
    dataIndex: 'classifiedName',
    key: 'classifiedName',
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'select',
      termFilter: ['in' , 'nin'],
      rename: 'classifiedId',
      componentProps: {
        placeholder: '请选择流程分类',
      },
      options: () => new Promise((resolve, reject) => {
        providerEnum().then(res => {
          if (res.success) {
            resolve(res.result.map((item) => {
              return {
                label: item.text,
                value: item.id,
                extra: item
              }
            }))
          } else {
            resolve([])
          }
        }).catch(() => { resolve([])})
      }),
    },
  },
  {
    title: '流程名称',
    dataIndex: 'modelName',
    key: 'modelName',
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
        // { label: '已准备', value: 'ready' },
        // { label: '运行中', value: 'running' },
        { label: '已完成', value: 'completed' },
        { label: '已驳回', value: 'rejected' },
        { label: '已关闭', value: 'repealed' },
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
      rename: 'creatorId',
      componentProps: {
        placeholder: '请选择发起人',
      },
      options: async () => {
        const resp = await getAllList_api({
          paging: false,
          sorts: [{ name: 'createTime', order: 'desc' }],
          terms: history.value
            ? []
            : [
                {
                  type: 'and',
                  value: 'running',
                  termType: 'eq',
                  column: 'state',
                },
              ],
          history: history.value,
        })
        const listMap = new Map()
        if (resp.status === 200) {
          resp.result.forEach((item) => {
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
    dataIndex: 'deployTime',
    key: 'deployTime',
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
const columns = computed(() => {
  return history.value
    ? defaultColumns
    : defaultColumns.filter(
        (item) => item.dataIndex !== 'state' && item.dataIndex !== 'endTime',
      )
})

// 弹窗
const dialog = reactive({
  selectItem: {},
  visible: false,
})

// 抽屉
const drawer = reactive({
  selectItem: {},
  visible: false,
})

const params = ref({})

const change = () => {
  nextTick(() => {
    params.value = {}
  })
  tableRef?.value?.reload()
}

const tableParams = computed(() => ({
  history: history.value,
  // terms: [
  //   history.value
  //     ? undefined
  //     : {
  //         type: 'and',
  //         value: 'running',
  //         termType: 'eq',
  //         column: 'state',
  //       },
  // ],
  ...params.value,
}))

const handleSearch = (data) => {
  params.value = data
}

const handleTurn = () => {
  dialog.visible = true
}

// 关闭
const handleClose = (id) => {
  close_api(id).then((res) => {
    if (res.success) {
      onlyMessage('操作成功')
      tableRef.value.reload()
    }
  })
}

// 详情
const handleDetail = (row) => {
  drawer.selectItem = { ...row }
  drawer.visible = true
}
</script>
<style scoped lang="less">
.tabs {
  :deep(.ant-tabs) {
    border: 1px solid #f0f0f0;
    .ant-tabs-nav {
      padding-left: 16px;
      background: #fff;
      margin: 0;
      border-bottom: 1px solid #d9d9d9;

      .tab-item {
        width: 96px;
        height: 28px;
        border-radius: 4px;
        text-align: center;
        line-height: 28px;
        color: #333333;
        &:hover {
          background: #e4eaff;
        }
      }
      .active {
        color: #315efb;
        background: #e4eaff;
      }
    }
    .ant-tabs-ink-bar {
      background-color: transparent;
    }
  }
}
</style>
