<template>

  <div style="width: 200px;margin: 100px;">
    <OppositeSelect :options="options" v-model:value="_value"/>
  </div>
  <div style="width: 30%;">
    <Card
      status="offline"
      :actions="actions"
      :record="record"
      statusText="测试文案"
      :statusNames="{
         online: 'processing',
         offline: 'error',
         notActive: 'warning',
      }"
    >
      <template #img>
        <div style="height: 88px;width: 88px; background-color: #dfdfdf;">
          Image
        </div>
      </template>
      <template #content>
        <h3 >
          {{ record.name }}
        </h3>
        <j-row>
          <j-col :span="12">
            <div >
              通知方式
            </div>
            <div>
              {{ record.other.name }}
            </div>
          </j-col>
          <j-col :span="12">
            <div>
              说明
            </div>
            <j-ellipsis>
              此处是说明，
            </j-ellipsis>
          </j-col>
        </j-row>
      </template>
    </Card>
  </div>
<!-- 卡片隐藏下面按钮操作 -->
  <div style="width: 30%;margin-top: 24px">
    <Card
      status="online"
      :actions="actions"
      :record="record"
      statusText="测试文案"
      :statusNames="{
         online: 'processing',
         offline: 'error',
         notActive: 'warning',
      }"
      :showTool="false"
    >
      <template #img>
        <div style="height: 88px;width: 88px; background-color: #dfdfdf;">
          Image
        </div>
      </template>
      <template #content>
        <h3 >
          {{ record.name }}
        </h3>
        <j-row>
          <j-col :span="12">
            <div >
              通知方式
            </div>
            <div>
              {{ record.other.name }}
            </div>
          </j-col>
          <j-col :span="12">
            <div>
              说明
            </div>
            <j-ellipsis>
              此处是说明，
            </j-ellipsis>
          </j-col>
        </j-row>
      </template>
    </Card>
  </div>
<!-- 卡片被选中 -->
  <div style="width: 30%;margin-top: 24px">
    <Card
      status="notActive"
      :actions="actions"
      :record="record"
      :active="true"
      statusText="测试文案"
      :statusNames="{
         online: 'processing',
         offline: 'error',
         notActive: 'warning',
      }"
    >
      <template #img>
        <div style="height: 88px;width: 88px; background-color: #dfdfdf;">
          Image
        </div>
      </template>
      <template #content>
        <h3 >
          {{ record.name }}
        </h3>
        <j-row>
          <j-col :span="12">
            <div >
              通知方式
            </div>
            <div>
              {{ record.other.name }}
            </div>
          </j-col>
          <j-col :span="12">
            <div>
              说明
            </div>
            <j-ellipsis>
              此处是说明，
            </j-ellipsis>
          </j-col>
        </j-row>
      </template>
    </Card>
  </div>
  <!-- 自定义颜色 -->
  <div style="width: 30%;margin-top: 24px">
    <Card
      status="notActive"
      :actions="actions"
      :record="record"
      :active="true"
      statusText="测试文案"
      :statusNames="{
         online: 'processing',
         error: 'error',
         notActive: 'warning',
      }"
      :statusColor="{
        'error': '',
        'offline': '160,217,17',
        'warning': '#13c2c2'
      }"
    >
      <template #img>
        <div style="height: 88px;width: 88px; background-color: #dfdfdf;">
          Image1
        </div>
      </template>
      <template #content>
        <h3 >
          {{ record.name }}
        </h3>
        <j-row>
          <j-col :span="12">
            <div >
              通知方式
            </div>
            <div>
              {{ record.other.name }}
            </div>
          </j-col>
          <j-col :span="12">
            <div>
              说明
            </div>
            <j-ellipsis>
              此处是说明，
            </j-ellipsis>
          </j-col>
        </j-row>
      </template>
    </Card>
  </div>
  <pro-image
    src="https://www.antdv.com/#error"
  />
</template>

<script setup>

const options = [
  {
    label:'选项1',
    value:'key1'
  },
  {
    label:'选项2',
    value:'key2'
  },
  {
    label:'选项3',
    value:'key3'
  }
]

const _value = ref()
watchEffect(()=>{
    console.log('=====',_value.value)
})
const record = {
  id: 'xxxxx',
  name: '测试card',
  other: {
    name: '测试用法'
  },
  status: 1
}
const handleView = (id) => {
  console.log(id)
}

const actions = [
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
        handleView(data.id);
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
        }
      },
      hasPermission: true,
      icon: 'EyeOutlined',
      onClick: () => {
        handleView(data.id);
      },
    }),
  }
]
</script>

<style scoped>

</style>
