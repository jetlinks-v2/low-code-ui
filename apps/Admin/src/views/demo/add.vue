<template>
  <QuickEditTable
    serial
    :data="data"
    :columns="columns"
    :height="500"
  >
    <template #column="{record, index}">
      <j-input v-model:value="record.column" @change="() => { alias(record.column, record) }" />
    </template>
    <template #description="{record, index}">
      <j-input v-model:value="record.description"/>
    </template>
    <template #javaType="{record, index}">
      <j-select style="width: 100%" />
    </template>
    <template #jdbcType="{record, index}">
      <j-select style="width: 100%" />
    </template>
    <template #readOnly="{ record }">
      <j-checkbox v-model:checked="record.readOnly" />
    </template>
  </QuickEditTable>
</template>

<script setup name="AddRemoveUpdateQuery">

import {upperCase} from "@/utils/comm";
import { downFile } from '@/api/basis'


downFile().then(res => {
  console.log(res)
})

const columns = [
  {
    title: '列',
    dataIndex: 'column',
    width: 200,
    tooltip: '蛇形命名'
  },
  {
    title: '别名',
    dataIndex: 'alias',
    tooltip: '驼峰命名',
    ellipsis: true
  },
  {
    title: '注释',
    dataIndex: 'description',
  },
  {
    title: 'javaType',
    dataIndex: 'javaType',
  },
  {
    title: 'jdbcType',
    dataIndex: 'jdbcType',
  },
  {
    title: '长度',
    dataIndex: 'length',
    width: 100
  },
  {
    title: '精度',
    dataIndex: 'precision',
    width: 100
  },
  {
    title: '只读',
    dataIndex: 'readOnly',
    width: 80
  },
  {
    title: '其它配置',
    dataIndex: 'setting',
    width: 120
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 120
  },
]

const data = ref([])

const alias = (name, record) => {
  record.alias = upperCase(name)
}

onMounted(() => {
  const len = 500
  data.value = new Array(len).fill(1).map((_, index) => {
    return {
      column: undefined,
      alias: undefined,
      description: 'description_'+index,
      javaType: 'javaType',
      jdbcType: 'jdbcType',
      length: index + 1,
      precision: 2,
      readOnly: index % 2 === 0,
      setting: {}
    }
  })
})

</script>

<style scoped>

</style>
