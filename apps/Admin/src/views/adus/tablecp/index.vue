<!-- 增删改查/表结构-->
<template>
  <div>
    <quick-edit-table :data="data" :columns="columns" @submit="handleSubmit">
    </quick-edit-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  {
    title: '序号', key: 'index', editable: false, editableType: 'text'
  },
  {
    title: '列', key: 'column', description: '蛇形命名',
    iconType: 'QuestionCircleOutlined',
    editable: false,
    editableType: 'text'
  },
  { title: '别名', key: 'alias', description: '驼峰命名', editable: false, editableType: 'text' },
  { title: '注释', key: 'comment', editable: false, editableType: 'text' },
  { title: 'jdbcType', key: 'jdbcType', editable: true, editableType: 'select' },
  { title: 'javaType', key: 'javaType', editable: true, editableType: 'select' },
  { title: '长度', key: 'length', editable: true, editableType: 'text' },
  { title: '精度', key: 'precision', editable: false, editableType: 'text' },
  { title: '只读', key: 'readOnly', editable: true, editableType: 'radio' },
  { title: '其他配置', key: 'otherConfig', editable: true, editableType: 'button' },
  { title: '操作', key: 'action', editable: true, editableType: 'buttons' },
]

// const data = ref([
//   {
//     column: '列数据',
//     alias: '别名数据',
//     comment: '注释数据',
//     jdbcType: 'jdbcType数据',
//     javaType: 'javaType数据',
//     length: '长度数据',
//     precision: '精度数据',
//     readOnly: '只读数据',
//     otherConfig: '其他配置数据',
//     action: '操作数据',
//     key: 1,
//     index: 1,
//   },
// ])

const data: any = ref([])
// 模拟生成大量数据
for (let i = 1; i <= 200; i++) {
  data.value.push({
    key: i, //测试数据 唯一id
    index: i, //序号
    column: '列数据',
    alias: '别名数据',
    comment: '注释数据',
    jdbcType: 'jdbcType数据',
    javaType: 'javaType数据',
    length: '长度数据',
    precision: '精度数据',
    readOnly: '只读数据',
    otherConfig: '其他配置数据',
    action: '操作数据',
  })
}

const handleSubmit = ({ index, key, value }) => {
  data.value[index][key] = value
}
</script>

<style scoped></style>
