<template>
  <div>
    <j-input v-model:value="tableName" placeholder="表名" @change="tableNameChange" />
    <QuickEditTable
      serial
      :data="data"
      :columns="columns"
      :height="500"
    >
      <template #column="{record, index}">
        <span v-if="index < 2"></span>
        <j-input v-else v-model:value="record.column" @change="() => { alias(record.column, record) }" />
      </template>
      <template #description="{record, index}">
        <span v-if="index < 2"></span>
        <j-input v-else v-model:value="record.description"/>
      </template>
      <template #javaType="{record, index}">
        <span v-if="index < 2"></span>
        <j-select style="width: 100%" />
      </template>
      <template #jdbcType="{record, index}">
        <span v-if="index < 2"></span>
        <j-select v-else style="width: 100%" />
      </template>
      <template #length="{ record }">
        <j-input-number v-model:value="record.length" />
      </template>
      <template #precision="{ record }">
        <j-input-number v-model:value="record.precision" />
      </template>
      <template #readOnly="{ record }">
        <j-checkbox v-model:checked="record.readOnly" />
      </template>
      <template #setting="{ record, index }">
        <j-button v-if="index > 2">
          配置
        </j-button>
      </template>
      <template #action="{ record, index }">
        <template v-if="index > 2">
          <j-button type="link">
            新增
          </j-button>
          <j-button type="link">
            复制
          </j-button>
          <j-button type="link">
            删除
          </j-button>
        </template>
      </template>
    </QuickEditTable>
  </div>
</template>

<script setup name="CRUDTable">
import { upperCase } from "@/utils/comm";
import { executeReq } from '@/api/basis'
import { debounce } from 'lodash-es'

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

const tableName = ref()

const data = ref([
  {
    column: 'id',
    alias: 'Id',
    description: '主键ID',
    javaType: 'string',
    jdbcType: 'bit',
    length: 11,
    precision: undefined,
    readOnly: false,
    setting: {}
  },
  {
    column: 'cus_id',
    alias: 'cusId',
    description: '主键ID',
    javaType: 'string',
    jdbcType: 'bit',
    precision: undefined,
    readOnly: false,
    setting: {}
  }
])

const alias = (name, record) => {
  record.alias = upperCase(name)
}

const tableNameChange = debounce(() => {
  executeReq('rdb-crud', 'CheckTableName').then(res => {
    console.log(res)
    if(res.success && res.result) {

    }
  })
}, 300)

</script>

<style scoped>

</style>
