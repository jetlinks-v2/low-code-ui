<template>
  <div class="list-form-preview">
    <div class="header">
      <j-page-header>
        <template #subTitle>
          <span class="sub-title">正在预览</span>
        </template>
        <template #extra>
          <j-button key="1">退出预览</j-button>
        </template>
      </j-page-header>
    </div>
    <div style="padding: 30px">
      <pro-search :columns="columns" target="code" @search="handleSearch" />

      <JProTable
        ref="tableRef"
        :columns="dataColumns"
        :data-source="dataSource"
      >
        <template #card="slotProps">
          <Card
            status="notActive"
            :actions="slotProps?.actions"
            :record="slotProps?.formState"
            :statusText="slotProps[cardConfig?.emphasisField] || '强调字段'"
            :statusNames="{
              online: 'processing',
              offline: 'error',
              notActive: 'warning',
            }"
            :statusColor="JSON.parse(cardConfig.specialStyle||`{}`)"
          >
            <template #img>
              <j-avatar
                shape="square"
                :size="100"
                :src="slotProps[cardConfig?.dynamicIcon] ? cardConfig?.customIcon :slotProps[cardConfig?.dynamicIcon]"
                class="card-icon"
              >
                <template #icon>
                  <pro-image src="https://www.antdv.com/#error" />
                </template>
              </j-avatar>
            </template>
            <template #content>
              <j-row>
                <j-col :span="12">
                  <h3>
                    {{ slotProps[cardConfig?.field1] || '字段1' }}
                  </h3>
                </j-col>
                <j-col :span="12">
                  <div class="emphasisField-text"></div>
                </j-col>
              </j-row>

              <j-row>
                <j-col :span="12">
                  <div>展示字段2</div>
                  <div>
                    {{ slotProps[cardConfig?.field2] || '字段2' }}
                  </div>
                </j-col>
                <j-col :span="12">
                  <div>展示字段3</div>
                  <div>
                    {{ slotProps[cardConfig?.field3] || '字段3' }}
                  </div>
                </j-col>
              </j-row>
            </template>
          </Card>
        </template>
        <template #action="slotProps"> </template>
      </JProTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useListDataStore } from '@/store/listData'
import { useListFormStore } from '@/store/listForm'
import Card from '@/components/Card'
const listDataStore = useListDataStore()
const listFormStore = useListFormStore()
const dataColumns = ref([])
const cardConfig = ref({
  customIcon: '',
  dynamicIcon: '',
  field1: '',
  field2: '',
  field3: '',
  emphasisField: '',
  specialStyle: '',
})
const dataSource = [
  {
    deviceId1: 'discussion1',
    deviceId2: 'discussion2',
    deviceId3: 'discussion3',
    deviceId4: 'discussion4',
    actions: [
      {
        key: 'view',
        text: '查看',
        permissionProps: (data) => ({
          tooltip: {
            title: '查看',
          },
          hasPermission: false,
          icon: 'EyeOutlined',
          onClick: (e) => {
            console.log(data)
            handleView(data.id)
          },
        }),
      },
      {
        key: 'view1',
        text: '查看1',
        permissionProps: {
          tooltip: {
            title: '查看1',
          },
          hasPermission: false,
          icon: 'EyeOutlined',
        },
      },
      {
        key: 'view2',
        text: '查看2',
      },

      {
        key: 'delete',
        text: '删除',
        permissionProps: (data) => ({
          tooltip: {
            title: '删除',
          },
          popConfirm: {
            title: data.status === 'error' ? '禁用' : '确认删除？',
            onConfirm: () => {
              console.log(data)
            },
          },
          hasPermission: true,
          icon: 'EyeOutlined',
          onClick: () => {
            handleView(data.id)
          },
        }),
      },
    ],
  },
  {
    deviceId1: 'discussion1',
    deviceId2: 'discussion2',
    deviceId3: 'discussion3',
    deviceId4: 'discussion4',
    actions: [
      {
        key: 'view',
        text: '查看',
        permissionProps: (data) => ({
          tooltip: {
            title: '查看',
          },
          hasPermission: false,
          icon: 'EyeOutlined',
          onClick: (e) => {
            console.log(data)
            handleView(data.id)
          },
        }),
      },
      {
        key: 'view1',
        text: '查看1',
        permissionProps: {
          tooltip: {
            title: '查看1',
          },
          hasPermission: false,
          icon: 'EyeOutlined',
        },
      },
      {
        key: 'view2',
        text: '查看2',
      },

      {
        key: 'delete',
        text: '删除',
        permissionProps: (data) => ({
          tooltip: {
            title: '删除',
          },
          popConfirm: {
            title: data.status === 'error' ? '禁用' : '确认删除？',
            onConfirm: () => {
              console.log(data)
            },
          },
          hasPermission: true,
          icon: 'EyeOutlined',
          onClick: () => {
            handleView(data.id)
          },
        }),
      },
    ],
  },
  {
    deviceId1: 'discussion1',
    deviceId2: 'discussion2',
    deviceId3: 'discussion3',
    deviceId4: 'discussion4',
    actions: [
      {
        key: 'view',
        text: '查看',
        permissionProps: (data) => ({
          tooltip: {
            title: '查看',
          },
          hasPermission: false,
          icon: 'EyeOutlined',
          onClick: (e) => {
            console.log(data)
            handleView(data.id)
          },
        }),
      },
      {
        key: 'view1',
        text: '查看1',
        permissionProps: {
          tooltip: {
            title: '查看1',
          },
          hasPermission: false,
          icon: 'EyeOutlined',
        },
      },
      {
        key: 'view2',
        text: '查看2',
      },

      {
        key: 'delete',
        text: '删除',
        permissionProps: (data) => ({
          tooltip: {
            title: '删除',
          },
          popConfirm: {
            title: data.status === 'error' ? '禁用' : '确认删除？',
            onConfirm: () => {
              console.log(data)
            },
          },
          hasPermission: true,
          icon: 'EyeOutlined',
          onClick: () => {
            handleView(data.id)
          },
        }),
      },
    ],
  },
  {
    deviceId1: 'discussion1',
    deviceId2: 'discussion2',
    deviceId3: 'discussion3',
    deviceId4: 'discussion4',
    actions: [
      {
        key: 'view',
        text: '查看',
        permissionProps: (data) => ({
          tooltip: {
            title: '查看',
          },
          hasPermission: false,
          icon: 'EyeOutlined',
          onClick: (e) => {
            console.log(data)
            handleView(data.id)
          },
        }),
      },
      {
        key: 'view1',
        text: '查看1',
        permissionProps: {
          tooltip: {
            title: '查看1',
          },
          hasPermission: false,
          icon: 'EyeOutlined',
        },
      },
      {
        key: 'view2',
        text: '查看2',
      },

      {
        key: 'delete',
        text: '删除',
        permissionProps: (data) => ({
          tooltip: {
            title: '删除',
          },
          popConfirm: {
            title: data.status === 'error' ? '禁用' : '确认删除？',
            onConfirm: () => {
              console.log(data)
            },
          },
          hasPermission: true,
          icon: 'EyeOutlined',
          onClick: () => {
            handleView(data.id)
          },
        }),
      },
    ],
  },
]

const params = ref()
const handleSearch = (data: any) => {
  console.log('data', data)
  params.value = data
}
const columns = [
  {
    title: '标识',
    dataIndex: 'id',
    key: 'id',
    ellipsis: true,
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入标识',
      },
    },
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入名称',
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
        { label: '已发布', value: 'publish' },
        { label: '未发布', value: 'unpublished' },
      ],
    },
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: true,
  },
]

watch(
  () => listDataStore.getDatasource(),
  (value: any) => {
    console.log('watch', value)

    dataColumns.value = value?.map((item: any) => {
      return {
        title: item.name,
        dataIndex: item.id,
        key: item.id,
        ellipsis: true,
        scopedSlots: true,
        align: item?.config?.colLayout,
        config: item.config,
      }
    })

    console.log(dataColumns.value)
  },
)
watch(
  () => listFormStore.getListFormInfo(),
  (value: any) => {
    cardConfig.value = value
    console.log(cardConfig.value, 'cardConfig')
  },
)
</script>
<style lang="less" scoped>
.ant-page-header {
  padding: 2px 20px 2px 20px;
}
.header {
  background-color: #808080;
  .sub-title {
    color: #f5f5f5;
    font-size: 20px;
  }
}
</style>
