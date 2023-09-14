<!-- <template>
  <div>
   <ConfigureMembers v-model:members="list"></ConfigureMembers>
 </div>
 </template>
 <script setup lang="ts">
 const list = ref([]);
 watchEffect(() => {
   console.log(`output->11111`,list.value)
 })
 </script>
 <style scoped lang="less">
 </style> -->
<template>
  <div>
    <Term
      ref="termRef"
      :variableData="propertyOption"
      :formData="formData"
    ></Term>
    <j-button @click="sub">提交</j-button>
  </div>
</template>
<script setup lang="ts">
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
]

const formData = [
  {
    column: 'properties.degrees.last',
    operator: 'eq',
    value: 12,
  },
  {
    column: 'lng',
    operator: '=',
    value: '123',
  },
]

const termRef = ref()
const sub = () => {
  termRef.value.validate().then((res) => {
    console.log(`output->res`, res)
  })
}
</script>
<style scoped lang="less"></style>
