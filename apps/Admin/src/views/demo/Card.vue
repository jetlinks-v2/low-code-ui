<template>
  <Card
    status="warning"
    :actions="actions"
  >
    <template #img>
      <div style="height: 88px;width: 88px; background-color: #dfdfdf;">
        Image
      </div>
    </template>
  </Card>
</template>

<script setup>
const handleView = (id) => {
  console.log(id)
}

const actions = [
  {
    key: 'view',
    text: '查看',
    permissionProps: {
      tooltip: {
        title: '查看',
      },
      hasPermission: false,
      icon: 'EyeOutlined',
      onClick: (data) => {
        handleView(data.id);
      },
    },
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
    permissionProps: {
      tooltip: {
        title: '删除',
      },
      popConfirm: (data) => ({
        title: data.status === 'error' ? '禁用' : '确认删除？',
        onConfirm: () => {

        }
      }),
      hasPermission: true,
      icon: 'EyeOutlined',
      onClick: (data) => {
        handleView(data.id);
      },
    },
  }
]
</script>

<style scoped>

</style>
