<template>
  <page-container>
    <pro-search :columns="columns" target="code" @search="handleSearch" />
    <JProTable ref="tableRef" model="CARD" :columns="columns" :params="params" :request="queryProject" :gridColumn="3"
      :defaultParams="{
        sorts: [{ name: 'createTime', order: 'desc' }],
      }">
      <template #headerTitle>
        <j-button type="primary" @click="handleSave('add')">新增</j-button>
      </template>
      <template #card="record">
        <Card :actions="getActions(record)" :record="record" :status="record.state.value" @click="_view(record.draftId)"
          :statusText="record.state.text" :statusNames="{
            unpublished: 'error',
            published: 'success',
          }">
          <template #content>
            <div class="card-item">
              <div class="title">
                <div>{{ record.id }}</div>
                <div class="title-tag"><j-tag :color="record.runningState.value === 'enabled' ? 'blue' : 'red'">{{
                  record.runningState.text }}</j-tag></div>
              </div>
              <div>项目名称：{{ record.name }}</div>
              <div>创建时间：{{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
              <div class="bottom">
                <div>最近发布：{{ record.deployTime ? dayjs(record.deployTime).format('YYYY-MM-DD HH:mm:ss') : '--' }}</div>
                <div v-if="record.changed" class="bottom-icon">
                  <j-tooltip>
                    <template #title>存在未发布的草稿，点击任意位置继续编辑</template>
                    <AIcon type="FormOutlined" style="color: black;" />
                  </j-tooltip>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </template>

    </JProTable>
    <Save v-if="visible" @close="handleClose" :data="current" :type="modelType" />
    <Menu v-if="visibleMenu" @close="visibleMenu = false" />
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
    title: '发布状态',
    dataIndex: 'state',
    key: 'state',
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'select',
      options: [
        { label: '已发布', value: 'published' },
        { label: '未发布', value: 'unpublished' },
      ],
    },
  },
  {
    title: '状态',
    dataIndex: 'runningState',
    key: 'runningState',
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
          title: record.runningState.value === 'enabled' ? '禁用' : 
          record.state.value==='published'?'启用':'请先发布项目',
        },
        popConfirm: {
          title: record.runningState.value === 'enabled' ? '确认禁用？' : '确认启用？',
          onConfirm: () => {
            _action(record.id, record.runningState.value)
          }
        },
        hasPermission: true,
        disabled:record.state.value!=='published' && record.runningState.value !== 'enabled',
        // icon: 'EyeOutlined',
      },
    },
    {
      key: 'menu',
      text: '菜单管理',
      permissionProps: {
        tooltip: {
          title: record.state.value==='published'?'菜单管理':'请先发布项目',
        },
        hasPermission: true,
        icon: 'EyeOutlined',
        disabled:record.state.value!=='published',
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
        disabled:data?.runningState.value === 'enabled',
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
  if (res.status === 200) {
    onlyMessage('操作成功')
    tableRef.value?.reload()
  }
}

</script>

<style scoped lang="less">
.card-item {
  color: #969696;


  .title {
    font-size: 22px;
    color: #000000;
    display: flex;
    margin-bottom: 10px;

    .title-tag {
      line-height: 22px;
      margin-left: 10px;
    }
  }

  .bottom {
    display: flex;

    .bottom-icon {
      margin-left: 5px;
    }
  }
}</style>
