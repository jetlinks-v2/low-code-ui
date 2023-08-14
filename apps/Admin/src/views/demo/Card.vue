<template>
  <div style="width: 30%;">
    <Card
      status="warning"
      :actions="actions"
      :record="record"
    >
      <template #img>
        <div style="height: 88px;width: 88px; background-color: #dfdfdf;">
          Image
        </div>
      </template>
    </Card>
  </div>

</template>

<script setup>

const record = {
  id: 'xxxxx',
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
