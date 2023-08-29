<template>
  <page-container>
    <pro-search :columns="columns" target="code" @search="handleSearch" />
    <JProTable ref="tableRef" model="CARD" :columns="columns" :params="params" :request="queryProject" :gridColumn="3">
      <template #headerTitle>
        <j-button type="primary" @click="handleSave('add')">新增</j-button>
      </template>
      <!-- <template #createTime="slotProps">
        <span>{{ slotProps?.createTime ? dayjs(slotProps.createTime).format('YYYY-MM-DD HH:mm:ss') : '' }}</span>
      </template>
      <template #state="slotProps">{{ slotProps.state?.text }}</template>
      <template #description="slotProps">
        <div>{{ slotProps.description ? slotProps.description : '--' }}</div>
      </template>
      <template #action="slotProps">
        <j-space :size="16">
          <j-tooltip>
            <template #title>
              查看
            </template>
            <j-button type="link" style="padding: 0;" v-if="slotProps.state.value !== 'publish'" @click="_view(slotProps.draftId)">
              <AIcon type="EyeOutlined" />
            </j-button>
            <j-dropdown v-else>
              <j-button type="link" style="padding: 0">
                <AIcon type="EyeOutlined" />
              </j-button>
              <template #overlay>
                <j-menu>
                  <j-menu-item>查看草稿</j-menu-item>
                  <j-menu-item>查看已发布项目</j-menu-item>
                </j-menu>
              </template>
            </j-dropdown>
          </j-tooltip>

          <j-tooltip>
            <template #title>
              编辑
            </template>
            <j-button type="link" style="padding: 0;" @click="handleSave('edit', slotProps)">
              <AIcon type="EditOutlined" />
            </j-button>
          </j-tooltip>


          <j-popconfirm title="确定删除？" :disabled="slotProps.state.value === 'publish'" @confirm="_del(slotProps.id)">
            <j-tooltip>
              <template #title>
                {{ slotProps.state.value === 'publish' ? '已发布状态的项目不支持删除' : '删除' }}
              </template>
              <j-button type="link" style="padding: 0;" danger :disabled="slotProps.state.value === 'publish'">
                <AIcon type="DeleteOutlined" />
              </j-button>
            </j-tooltip>
          </j-popconfirm>
        </j-space>
      </template> -->

      <template #card="record">
        <Card :actions="getActions(record)" :record="record" :status="record.runningState.value"
          @click="_view(record.draftId)" :statusText="record.runningState.text" :statusNames="{
            enabled: 'processing',
            disabled: 'error',
          }">
          <template #content>
            <div>项目标识：{{ record.id }}</div>
            <div>项目名称：{{ record.name }}</div>
            <div>创建时间：{{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
            <div>最近发布：{{ record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '--' }}</div>
          </template>
        </Card>
      </template>

    </JProTable>
    <Save v-if="visible" @close="handleClose" :data="current" :type="modelType" />
    <Menu v-if="visibleMenu" @close="visibleMenu=false"/>
  </page-container>
</template>

<script lang="ts" setup name="index" >
import Save from './Save/index.vue'
import dayjs from 'dayjs';
import { queryProject, delProject, enableProject, disabledProject } from '@/api/project'
import { onlyMessage } from '@/utils/comm';
import { router } from '@jetlinks/router';
import Menu from './Menu/index.vue'

const params = ref<any>({})
const tableRef = ref<Record<string, any>>({});
const current = ref({})
const modelType = ref<string>('add')
const visible = ref<boolean>(false)
const visibleMenu = ref<boolean>(false)

const columns = [
  {
    title: '项目标识',
    dataIndex: 'id',
    key: 'id',
    ellipsis: true,
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入项目标识',
      },
    },
  },
  {
    title: '项目名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入项目名称',
      },
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
    title: '最新发布',
    dataIndex: 'version',
    key: 'version',
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
      options: [
        { label: '已发布', value: 'publish' },
        { label: '未发布', value: 'unpublished' },
      ],
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
    title: '操作',
    key: 'action',
    scopedSlots: true,
  },
]

const getActions = (record) => {
  return [
    {
      key: 'edit',
      text: '编辑',
      permissionProps: (data) => ({
        tooltip: {
          title: '编辑',
        },
        hasPermission: false,
        icon: 'EditOutlined',
        onClick: () => {
          handleSave('edit', data)
        },
      }),
    },
    {
      key: 'action',
      text: record.runningState.value === 'enabled' ? '禁用' : '启用',
      permissionProps: {
        tooltip: {
          title: record.runningState.value === 'enabled' ? '禁用' : '启用',
        },
        popConfirm: {
          title: record.runningState.value === 'enabled' ? '确认禁用？' : '确认启用？',
          onConfirm: () => {
            _action(record.id,record.runningState.value)
          }
        },
        hasPermission: true,
        // icon: 'EyeOutlined',
      },
    },
    {
      key: 'menu',
      text: '菜单管理',
      permissionProps: {
        tooltip: {
          title: '菜单管理',
        },
        hasPermission: true,
        icon: 'EyeOutlined',
        onClick: () => {
          console.log(record)
          visibleMenu.value = true
        }
      },
    },
    {
      key: 'delete',
      text: '删除',
      permissionProps: (data) => ({
        tooltip: {
          title: data?.runningState.value === 'enabled' ? '启用状态的项目不支持删除' : '删除',
        },

        popConfirm: {
          title: '确认删除？',
          onConfirm: () => {
            _del(data.id)
          }
        },
        hasPermission: true,
        // disabled:true,
      }),
    }
  ]
}


const handleSearch = (data: any) => {
  params.value = data
}

const handleSave = (type: string, data?: any) => {
  modelType.value = type
  visible.value = true
  current.value = data
}

const handleClose = () => {
  visible.value = false
  tableRef.value?.reload()
}

const _view = (id: string) => {
  router.replace(`/engine/${id}`)
}

const _del = async (id: string) => {
  const res = await delProject(id)
  if (res.status === 200) {
    onlyMessage('操作成功')
    tableRef.value?.reload()
  }
}

const _action = async (id: string, type: string) => {
  const res = type === 'enabled' ? await disabledProject(id) : await enableProject(id)
  if(res.status === 200){
    onlyMessage('操作成功')
    tableRef.value?.reload()
  }
}

</script>

<style scoped></style>
