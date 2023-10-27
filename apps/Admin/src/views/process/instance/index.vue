<!-- 流程实例 -->
<template>
  <page-container>
    <pro-search :columns="columns" target="code" @search="handleSearch" />
    <JProTable
      ref="tableRef"
      :columns="columns"
      :params="params"
      :request="getList_api"
      :gridColumn="2"
      :defaultParams="{
        sorts: [{ name: 'createTime', order: 'desc' }],
      }"
    >
      <template #icon="{ icon }">
        <ProImage
          v-if="isImg(icon)"
          :width="50"
          :height="50"
          :src="icon"
          :preview="false"
        />
        <AIcon v-else :type="icon" :style="{ fontSize: '40px' }" />
      </template>
      <template #state="{ state }">
        <BadgeStatus
          :status="state.value"
          :text="state.text"
          :statusNames="{
            disabled: 'error',
            enabled: 'processing',
          }"
        />
      </template>
      <template #createTime="{ createTime }">
        {{ dayjs(createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template #action="slotProps">
        <div class="table-action">
          <PermissionButton
            type="link"
            v-for="item of getActions(slotProps, 'table')"
            v-bind="handleFunction(item.permissionProps, slotProps)"
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
            enabled: 'processing',
          }"
          @click="_view(record)"
        >
          <template #content>
            <div class="card-item">
              <div class="title">
                <div class="classification">
                  <j-ellipsis style="max-width: 200px">
                    {{ record.classifiedName }}
                  </j-ellipsis>
                </div>
                <div class="card-content">
                  <!-- 流程图标 -->
                  <j-space :size="24" align="center">
                    <ProImage
                      v-if="isImg(record.icon)"
                      :width="64"
                      :height="64"
                      :src="record.icon"
                      :preview="false"
                    />
                    <AIcon
                      v-else
                      :type="record.icon"
                      :style="{ fontSize: '40px' }"
                    />
                    <div>
                      <div class="name">{{ record.name }}</div>
                      <div class="other">
                        <j-ellipsis style="width: 200px">
                          <span class="text">部署人：</span>
                          <span class="value">{{ record.creatorName }}</span>
                        </j-ellipsis>
                        <div>
                          <span class="text"> 部署时间： </span>
                          <span class="value">
                            {{
                              dayjs(record.createTime).format(
                                'YYYY-MM-DD HH:mm:ss',
                              )
                            }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </j-space>
                </div>
              </div>
              <!-- <div style="display: flex">
                <span>部署人：</span>
                <j-ellipsis style="width: 200px">
                  {{ record.creatorName }}
                </j-ellipsis>
              </div>
              <div>
                部署时间：{{
                  dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')
                }}
              </div> -->
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
    <PermissionDialog
      v-if="permission.visible"
      v-model:visible="permission.visible"
      :data="permission.selectItem"
      @refresh="refresh"
    />
  </page-container>
</template>
<script setup>
import { onlyMessage } from '@jetlinks/utils'
import dayjs from 'dayjs'
import Dialog from './Dialog/index.vue'
import Drawer from '../components/Drawer/index.vue'
import PermissionDialog from './PermissionDialog/index.vue'
import { isFunction, isObject } from 'lodash-es'
import { getList_api, del_api, updateState_api } from '@/api/process/instance'
import { useClassified } from '@/hooks/useClassified'
import { isImg } from '@/utils/comm'

const { classified } = useClassified()
const tableRef = ref()
const columns = [
  {
    title: '流程图标',
    dataIndex: 'icon',
    key: 'icon',
    ellipsis: true,
    scopedSlots: true,
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
    dataIndex: 'classifiedName',
    key: 'classifiedName',
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'select',
      rename: 'classifiedId',
      componentProps: {
        placeholder: '请选择流程分类',
      },
      options: classified,
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
      type: 'select',
      rename: 'creatorId',
      componentProps: {
        placeholder: '请选择部署人',
      },
      options: async () => {
        const resp = await getList_api({
          paging: false,
          sorts: [{ name: 'createTime', order: 'desc' }],
        })
        const listMap = new Map()
        if (resp.success) {
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
    title: '部署时间',
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

// 权限控制
const permission = reactive({
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
            updateState_api({
              id: data.id,
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
      key: 'permission',
      text: '权限控制',
      icon: 'DeploymentUnitOutlined',
      permissionProps: (data) => ({
        tooltip: {
          title: '权限控制',
        },
        hasPermission: false,
        onClick: () => {
          permission.selectItem = { ...data }
          permission.visible = true
        },
      }),
    },
    {
      key: 'delete',
      text: '删除',
      icon: 'DeleteOutlined',
      permissionProps: (data) => ({
        // 实例下有发起过的流程时，删除按钮置灰
        disabled: record.state?.value !== 'disabled',
        tooltip: {
          title: record.state?.value !== 'disabled' ? '请先禁用再删除' : '删除',
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
.card-item {
  .classification {
    font-size: 20px;
    font-weight: 500;
    line-height: 20px;
    color: #0a1b30;
    height: 44px;
  }
  .card-content {
    height: 64px;
    .name {
      margin-bottom: 16px;
      font-size: 16px;
      line-height: 16px;
      font-weight: 500;
      color: #333333;
    }
    .other {
      display: inline-flex;

      .text {
        color: rgba(10, 27, 48, 0.6);
      }
      .value {
        color: rgba(10, 27, 48, 0.4);
      }
    }
  }
}
</style>
