<!-- 条件节点配置 -->
<template>
  <j-tabs v-model:activeKey="activeKey" type="card">
    <j-tab-pane key="basic" tab="基础配置">
      <j-form ref="basicFormRef" :model="basicFormData" layout="vertical">
        <h3>条件配置</h3>
        <j-form-item label="请配置进入下方节点的条件" name="forms">
          <Term
            ref="termRef"
            :variableData="propertyOption"
            :formData="formData"
          ></Term>
        </j-form-item>
      </j-form>
    </j-tab-pane>
  </j-tabs>
</template>

<script setup lang="ts">
const activeKey = ref('basic')
const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
})

// 基础配置
const basicFormRef = ref()
const basicFormData = ref({
  forms: [],
})

const propertyOption = [
  {
    column: 'timestamp',
    name: '上报时间',
    fullName: '上报时间',
    description: '数据上报时指定的时间',
    dataType: 'date',
    metadata: false,
    termTypes: [
      {
        id: 'eq',
        name: '等于',
      },
      {
        id: 'neq',
        name: '不等于',
      },
      {
        id: 'gt',
        name: '大于',
      },
      {
        id: 'gte',
        name: '大于等于',
      },
      {
        id: 'lt',
        name: '小于',
      },
      {
        id: 'lte',
        name: '小于等于',
      },
      {
        id: 'btw',
        name: '在...之间',
      },
      {
        id: 'nbtw',
        name: '不在...之间',
      },
      {
        id: 'time_gt_now',
        name: '距离当前时间大于...秒',
      },
      {
        id: 'time_lt_now',
        name: '距离当前时间小于...秒',
      },
    ],
  },
  {
    column: 'total_power_factor',
    name: '总功率因素',
    fullName: '总功率因素',
    description: '属性',
    dataType: 'boolean',
    metadata: true,
    termTypes: [
      {
        id: 'eq',
        name: '等于',
      },
      {
        id: 'neq',
        name: '不等于',
      },
      {
        id: 'gt',
        name: '大于',
      },
      {
        id: 'gte',
        name: '大于等于',
      },
      {
        id: 'lt',
        name: '小于',
      },
      {
        id: 'lte',
        name: '小于等于',
      },
      {
        id: 'btw',
        name: '在...之间',
      },
      {
        id: 'nbtw',
        name: '不在...之间',
      },
      {
        id: 'in',
        name: '在...之中',
      },
      {
        id: 'nin',
        name: '不在...之中',
      },
    ],
    metrics: [],
    children: [
      {
        column: 'properties.total_power_factor.last',
        name: '上一值',
        fullName: '总功率因素/上一值',
        description: '上一次上报的数据值',
        dataType: 'double',
        metadata: true,
        termTypes: [
          {
            id: 'eq',
            name: '等于',
          },
          {
            id: 'neq',
            name: '不等于',
          },
          {
            id: 'gt',
            name: '大于',
          },
          {
            id: 'gte',
            name: '大于等于',
          },
          {
            id: 'lt',
            name: '小于',
          },
          {
            id: 'lte',
            name: '小于等于',
          },
          {
            id: 'btw',
            name: '在...之间',
          },
          {
            id: 'nbtw',
            name: '不在...之间',
          },
          {
            id: 'in',
            name: '在...之中',
          },
          {
            id: 'nin',
            name: '不在...之中',
          },
        ],
        metrics: [],
      },
    ],
  },
  {
    column: 'degrees',
    name: '表计度数',
    fullName: '表计度数',
    description: '属性',
    dataType: 'double',
    metadata: true,
    termTypes: [
      {
        id: 'eq',
        name: '等于',
      },
      {
        id: 'neq',
        name: '不等于',
      },
      {
        id: 'gt',
        name: '大于',
      },
      {
        id: 'gte',
        name: '大于等于',
      },
      {
        id: 'lt',
        name: '小于',
      },
      {
        id: 'lte',
        name: '小于等于',
      },
      {
        id: 'btw',
        name: '在...之间',
      },
      {
        id: 'nbtw',
        name: '不在...之间',
      },
      {
        id: 'in',
        name: '在...之中',
      },
      {
        id: 'nin',
        name: '不在...之中',
      },
    ],
    metrics: [],
    children: [
      {
        column: 'properties.degrees.last',
        name: '上一值',
        fullName: '表计度数/上一值',
        description: '上一次上报的数据值',
        dataType: 'double',
        metadata: true,
        termTypes: [
          {
            id: 'eq',
            name: '等于',
          },
        ],
        metrics: [],
      },
    ],
  },
]

const formData = [
  {
    column: 'properties.total_power_factor.last',
    operator: 'eq',
    value: 12,
  },
  {
    column: 'properties.degrees.last',
    operator: 'eq',
    value: '123',
  },
]
</script>

<style lang="less" scoped></style>
