<!-- 流程实例 -->
<template>
  <page-container>
    <pro-search :columns="columns" target="code" @search="handleSearch" />
    <JProTable
      ref="tableRef"
      :columns="columns"
      :params="params"
      :request="getList_api"
      :gridColumn="3"
      :defaultParams="{
        sorts: [{ name: 'createTime', order: 'desc' }],
      }"
    >
      <template #state="{ state }">
        <BadgeStatus
          :status="state.value"
          :text="state.text"
          :statusNames="{
            disabled: 'error',
            enabled: 'success',
          }"
        />
      </template>

      <template #action="slotProps">
        <div class="table-action">
          <PermissionButton
            type="link"
            v-for="item of getActions(slotProps, 'table')"
            v-bind:="handleFunction(item.permissionProps, slotProps)"
            :danger="item.key === 'delete'"
          >
            <template #icon v-if="item.icon || item.key === 'delete'">
              <AIcon :type="item.icon ? item.icon : 'DeleteOutlined'" />
            </template>
            <!-- <span v-if="item.key !== 'delete'">
              {{ item.text }}
            </span> -->
          </PermissionButton>
        </div>
      </template>
      <template #card="record">
        <Card
          :actions="getActions(record)"
          :record="record"
          :status="record.state.value"
          :statusText="record.state.text"
          :statusNames="{
            disabled: 'error',
            enabled: 'success',
          }"
          @click="_view(record)"
        >
          <template #content>
            <div class="card-item">
              <div class="title">
                <j-ellipsis style="max-width: 200px">
                  流程分类：{{ record.name }}
                </j-ellipsis>
                <div class="title-icon">
                  <!-- 流程图标 -->
                  {{ record.icon }}
                  <AIcon :type="record.icon ? record.icon : 'DeleteOutlined'" />
                </div>
              </div>
              <div style="display: flex">
                <span>部署人</span>
                <j-ellipsis style="width: 200px">
                  {{ record.creatorName }}
                </j-ellipsis>
              </div>
              <div>
                部署时间：{{
                  dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')
                }}
              </div>
            </div>
          </template>
        </Card>
      </template>
    </JProTable>
    <Dialog
      v-if="dialog.visible"
      v-model:visible="dialog.visible"
      :data="dialog.selectItem"
      @refresh="refresh"
    />
    <Drawer
      v-if="drawer.visible"
      v-model:visible="drawer.visible"
      :data="drawer.selectItem"
    />
  </page-container>
</template>
<script setup>
import { onlyMessage } from '@jetlinks/utils'
import dayjs from 'dayjs'
import Dialog from './Dialog/index.vue'
import Drawer from './Drawer/index.vue'
import { isFunction, isObject } from 'lodash-es'
import { getList_api, del_api } from '@/api/process/instance'
import { saveProcess_api } from '@/api/process/model'

const tableRef = ref()
const columns = [
  {
    title: '流程图标',
    dataIndex: 'icon',
    key: 'icon',
    ellipsis: true,
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
    title: '版本号',
    dataIndex: 'version',
    key: 'version',
    ellipsis: true,
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入版本号',
      },
    },
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'select',
      options: [
        { label: '启用', value: 'enabled' },
        { label: '禁用', value: 'disabled' },
      ],
    },
  },
  {
    title: '部署人',
    dataIndex: 'creatorName',
    key: 'creatorName',
    ellipsis: true,
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入部署人',
      },
    },
  },
  {
    title: '部署时间',
    dataIndex: 'createTime',
    key: 'createTime',
    ellipsis: true,
    search: {
      type: 'date',
    },
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: true,
    width: 300,
  },
]
const params = ref({})
// 复制为模型弹窗
const dialog = reactive({
  selectItem: {},
  visible: false,
})

// 抽屉
const drawer = reactive({
  selectItem: {},
  visible: false,
})

const getActions = (record, type = 'card') => {
  const actions = [
    {
      key: 'edit',
      text: '复制为模型',
      icon: 'CopyOutlined',
      permissionProps: (data) => ({
        tooltip: {
          title: '复制为模型',
        },
        hasPermission: false,
        onClick: () => {
          copyAsModel(data)
        },
      }),
    },
    {
      key: 'action',
      text: record.state?.value !== 'disabled' ? '禁用' : '启用',
      icon:
        record.state?.value !== 'disabled'
          ? 'StopOutlined'
          : 'CheckCircleOutlined',
      permissionProps: (data) => ({
        tooltip: {
          title: record.state?.value !== 'disabled' ? '禁用' : '启用',
        },
        hasPermission: false,
        popConfirm: {
          title: `确认${record.state?.value !== 'disabled' ? '禁用' : '启用'}`,
          onConfirm: () => {
            saveProcess_api({
              ...data,
              state:
                record.state?.value !== 'disabled' ? 'disabled' : 'enabled',
            }).then((res) => {
              if (res.success) {
                onlyMessage('操作成功')
                refresh()
              } else {
                onlyMessage('操作失败', 'error')
              }
            })
          },
        },
      }),
    },
    {
      key: 'delete',
      text: '删除',
      icon: 'DeleteOutlined',
      permissionProps: (data) => ({
        tooltip: {
          title: '删除',
        },
        hasPermission: false,
        popConfirm: {
          title: `确认删除`,
          onConfirm: () => {
            del_api(data.id).then((res) => {
              if (res.success) {
                onlyMessage('操作成功')
                refresh()
              } else {
                onlyMessage('操作失败', 'error')
              }
            })
          },
        },
      }),
    },
  ]
  if (type === 'table') {
    actions.splice(0, 0, {
      key: 'view',
      text: '查看',
      icon: 'EyeOutlined',
      permissionProps: (data) => ({
        tooltip: {
          title: '查看',
        },
        hasPermission: false,
        onClick: () => {
          _view(data)
        },
      }),
    })
  }
  return actions
}

const handleFunction = (item, record) => {
  if (isFunction(item)) {
    return item(record)
  } else if (isObject(item)) {
    return item
  }
  return undefined
}

/**
 * 搜索
 * @param data
 */
const handleSearch = (data) => {
  params.value = data
}

/**
 * 复制为模型
 * @param data
 */
const copyAsModel = (data) => {
  dialog.selectItem = { ...data }
  dialog.visible = true
}

/**
 * 展示流程详情抽屉页
 * @param id
 */
const _view = (data) => {
  drawer.selectItem = { ...data }
  drawer.visible = true
}

/**
 * 刷新
 */
const refresh = () => {
  tableRef.value.reload()
}
</script>
<style scoped lang="less">
.table-action {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
