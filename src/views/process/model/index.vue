<!-- 流程模型 -->
<template>
  <page-container>
    <pro-search :columns="columns" target="model" @search="handleSearch" />
    <JProTable
      ref="tableRef"
      :columns="columns"
      :params="params"
      :request="_query"
      :gridColumn="2"
      :defaultParams="{
        sorts: [{ name: 'createTime', order: 'desc' }],
      }"
    >
      <template #headerTitle>
        <PermissionButton
          type="primary"
          @click="handleSave(undefined)"
          hasPermission="process/model:add"
        >
          <!-- <AIcon type="PlusOutlined" /> -->
          新增</PermissionButton
        >
      </template>
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
            undeployed: 'error',
            deployed: 'processing',
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
            undeployed: 'error',
            deployed: 'processing',
          }"
          @click="handleView(record)"
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
                  <!-- <AIcon :type="record.icon ? record.icon : 'DeleteOutlined'" /> -->
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
                    <div class="right">
                      <j-ellipsis style="max-width: 200px">
                        <div class="name">{{ record.name }}</div>
                      </j-ellipsis>
                      <div class="other">
                        <j-ellipsis style="width: 200px">
                          <span class="text">创建人：</span>
                          <span class="value">{{ record.creatorName }}</span>
                        </j-ellipsis>
                        <div>
                          <span class="text"> 创建时间： </span>
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
    <!-- 隐藏域, 仅用于部署校验每一步数据, noQuery: 不查询接口 -->
    <div class="validate-box">
      <BasicInfo ref="step1" />
      <FlowDesign ref="step2" />
      <ShowCopy ref="step3" :noQuery="true" />
    </div>
  </page-container>
</template>
<script setup>
import { onlyMessage } from '@jetlinks-web/utils'
import dayjs from 'dayjs'
import Dialog from './Dialog/index.vue'
import Drawer from '../components/Drawer/index.vue'
import { isFunction, isObject } from 'lodash-es'
import {
  getProcess_api,
  getAllProcess_api,
  deploy_api,
  del_api,
  detail_api,
  update_api,
} from '@LowCode/api/process/model'
import { useClassified } from '@LowCode/hooks/useClassified'
import { isImg } from '@LowCode/utils/comm'
import BasicInfo from '@LowCode/views/process/model/Detail/BasicInfo/index.vue'
import FlowDesign from '@LowCode/views/process/model/Detail/FlowDesign/index.vue'
import ShowCopy from '@LowCode/views/process/model/Detail/ShowCopy/index.vue'
import { useFlowStore } from '@LowCode/store/flow'
import { Modal } from 'jetlinks-ui-components'
import { store } from '@jetlinks-web/stores'
import { Card , Search as ProSearch , BadgeStatus , ProImage} from '@LowCode/components/index'

const menu = store.useMenuStore()
const flowStore = useFlowStore()
const step1 = ref()
const step2 = ref()
const step3 = ref()
const { classified } = useClassified()
const tableRef = ref()
const params = ref({})
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
      termFilter: ['in' , 'nin'],
      rename: 'classifiedId',
      componentProps: {
        placeholder: '请选择流程分类',
      },
      options: async () => {
        const resp = await getAllProcess_api({
          paging: false,
          sorts: [{ name: 'createTime', order: 'desc' }],
        })
        const listMap = new Map()
        if (resp.status === 200) {
          resp.result.forEach((item) => {
            listMap.set(item.classifiedId, {
              label: item.classifiedName,
              value: item.classifiedId,
            })
          })
          const _keys = classified.value.map((m) => m.value)
          if (listMap.size) {
            return [...listMap.values()]
              .map((m) => ({
                ...m,
                sort: _keys.indexOf(m.value),
              }))
              .sort((a, b) => a.sort - b.sort)
              .filter((i) => i.label)
          } else {
            return []
          }
        }
        return []
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
      componentProps: {
        placeholder: '请选择状态',
      },
      options: [
        { label: '已部署', value: 'deployed' },
        { label: '未部署', value: 'undeployed' },
      ],
    },
  },
  {
    title: '创建人',
    dataIndex: 'creatorName',
    key: 'creatorName',
    ellipsis: true,
    search: {
      type: 'select',
      rename: 'creatorId',
      componentProps: {
        placeholder: '请选择创建人',
      },
      options: async () => {
        const resp = await getAllProcess_api({
          paging: false,
          sorts: [{ name: 'createTime', order: 'asc' }],
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
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    scopedSlots: true,
    ellipsis: true,
    search: {
      type: 'date',
    },
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: true,
    width: 320,
  },
]

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

const getActions = (record, type = 'card') => {
  const actions = [
    {
      key: 'preview',
      text: '预览',
      icon: 'PlayCircleOutlined',
      permissionProps: (data) => ({
        tooltip: {
          title: '预览',
        },
        onClick: () => {
          _view(data)
        },
      }),
    },
    {
      key: 'edit',
      text: '编辑',
      icon: 'EditOutlined',
      permissionProps: (data) => ({
        tooltip: {
          title: '编辑',
        },
        hasPermission: 'process/model:update',
        onClick: () => {
          handleSave(data)
        },
      }),
    },
    {
      key: 'view',
      text: '查看',
      icon: 'EyeOutlined',
      permissionProps: (data) => ({
        tooltip: {
          title: '查看',
        },
        onClick: () => {
          handleView(data)
        },
      }),
    },
    {
      key: 'edit',
      text: '部署',
      icon: 'DeploymentUnitOutlined',
      permissionProps: (data) => ({
        loading: data.loading,
        disabled: data.state.value === 'deployed',
        tooltip: {
          title: data.state.value === 'deployed' ? '请勿重复部署' : '部署',
        },
        hasPermission: 'process/model:deploy',
        onClick: async () => {
          data.loading = true
          try {
            const { result } = await detail_api(data.id)
            const model = JSON.parse(result.model || '{}')
            flowStore.setModel(model)
            flowStore.setModelBaseInfo(result)
            await step1.value.getLatestFormList()
            Promise.allSettled([
              step1.value?.validateSteps(),
              step2.value?.validateSteps(),
              step3.value?.validateSteps(),
            ]).then(async (valid) => {
              // 验证通过后保存新表单
              const params = {
                id: data.id,
                model: JSON.stringify(flowStore.model),
              }
              const res = await update_api(params)
              if (
                Array.isArray(valid) &&
                valid.every((item) => item.status === 'fulfilled')
              ) {
                deploy_api(data.id).then((resp) => {
                  if (resp.success) {
                    onlyMessage('操作成功')
                    refresh()
                  }
                }).finally(() => {
                    data.loading = false
                })
              } else {
                Modal.error({
                  title: '部署失败，流程配置内容不合规',
                })
              }
            })
          } catch (error) {
          } finally {
            // data.loading = false
          }
        },
      }),
    },
    {
      key: 'delete',
      text: '删除',
      icon: 'DeleteOutlined',
      permissionProps: (data) => ({
        // disabled: data.state.value === 'deployed',
        tooltip: {
          title: '删除',
          placement: 'topRight',
        },
        hasPermission: 'process/model:delete',
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

  if (type === 'card') {
    return actions.filter((i) => i.key !== 'view')
  } else {
    return actions
  }
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
 * 新增/修改
 * @param data
 */
const handleSave = (data) => {
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
 * 查看
 * @param data
 */
const handleView = (data) => {
  menu.jumpPage('process/model/Detail', {
    query: {
      id: data.id,
    },
  })
}

/**
 * 刷新
 */
const refresh = () => {
  tableRef.value.reload()
}

const _query = async (e) => {
  const resp = await getProcess_api(e)
  return {
    result: {
      data: resp.result.data.map((i) => ({ ...i, loading: false })),
      pageIndex: e.pageIndex,
      pageSize: e.pageSize,
      total: resp.result.total,
    },
    status: resp.status,
  }
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

    .right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
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
}
.validate-box {
  width: 0;
  height: 0;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
