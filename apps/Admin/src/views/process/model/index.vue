<!-- 流程模型 -->
<template>
  <page-container>
    <pro-search :columns="columns" target="model" @search="handleSearch" />
    <JProTable
      ref="tableRef"
      :columns="columns"
      :params="params"
      :request="getProcess_api"
      :gridColumn="2"
      :defaultParams="{
        sorts: [{ name: 'createTime', order: 'desc' }],
      }"
    >
      <template #headerTitle>
        <PermissionButton type="primary" @click="handleSave(undefined)">
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
  </page-container>
</template>
<script setup>
import { onlyMessage } from '@jetlinks/utils'
import dayjs from 'dayjs'
import Dialog from './Dialog/index.vue'
import Drawer from '../components/Drawer/index.vue'
import { isFunction, isObject } from 'lodash-es'
import { getProcess_api, deploy_api, del_api } from '@/api/process/model'
import { useClassified } from '@/hooks/useClassified'
import { isImg } from '@/utils/comm'

const { classified } = useClassified()
const router = useRouter()
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
        const resp = await getProcess_api({
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
    width: 300,
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
      key: 'edit',
      text: '预览',
      icon: 'PlayCircleOutlined',
      permissionProps: (data) => ({
        tooltip: {
          title: '预览',
        },
        hasPermission: false,
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
        hasPermission: false,
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
        hasPermission: false,
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
        disabled: data.state.value === 'deployed',
        tooltip: {
          title: data.state.value === 'deployed' ? '请勿重复部署' : '部署',
        },
        hasPermission: false,
        onClick: () => {
          deploy_api(data.id).then((res) => {
            if (res.success) {
              onlyMessage('操作成功')
              refresh()
            } else {
              onlyMessage('操作失败', 'error')
            }
          })
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
  router.push({
    path: '/flow-engine/model/detail',
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
</style>
