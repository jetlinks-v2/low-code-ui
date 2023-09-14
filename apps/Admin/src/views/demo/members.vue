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
    column: '_now',
    name: '系统时间',
    fullName: '系统时间',
    description: '服务器时间',
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
  {
    column: 'V_c',
    name: '电压C',
    fullName: '电压C',
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
        column: 'properties.V_c.last',
        name: '上一值',
        fullName: '电压C/上一值',
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
    column: 'V_b',
    name: '电压B',
    fullName: '电压B',
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
        column: 'properties.V_b.last',
        name: '上一值',
        fullName: '电压B/上一值',
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
    column: 'V_a',
    name: '电压A',
    fullName: '电压A',
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
        column: 'properties.V_a.last',
        name: '上一值',
        fullName: '电压A/上一值',
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
    column: 'I_c',
    name: '电流C',
    fullName: '电流C',
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
        column: 'properties.I_c.last',
        name: '上一值',
        fullName: '电流C/上一值',
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
    column: 'I_b',
    name: '电流B',
    fullName: '电流B',
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
        column: 'properties.I_b.last',
        name: '上一值',
        fullName: '电流B/上一值',
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
    column: 'I_a',
    name: '电流A',
    fullName: '电流A',
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
        column: 'properties.I_a.last',
        name: '上一值',
        fullName: '电流A/上一值',
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
    column: 'reactive_power',
    name: '总无功功率',
    fullName: '总无功功率',
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
        column: 'properties.reactive_power.last',
        name: '上一值',
        fullName: '总无功功率/上一值',
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
    column: 'active_electric',
    name: '总有功电能',
    fullName: '总有功电能',
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
        column: 'properties.active_electric.last',
        name: '上一值',
        fullName: '总有功电能/上一值',
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
    column: 'active_power',
    name: '总有功功率',
    fullName: '总有功功率',
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
        column: 'properties.active_power.last',
        name: '上一值',
        fullName: '总有功功率/上一值',
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
    column: 'power',
    name: '用电量',
    fullName: '用电量',
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
        column: 'properties.power.last',
        name: '上一值',
        fullName: '用电量/上一值',
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
    column: 'lat',
    name: '纬度',
    fullName: '纬度',
    description: '属性',
    dataType: 'geoPoint',
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
    ],
    metrics: [],
    children: [
      {
        column: 'properties.lat.last',
        name: '上一值',
        fullName: '纬度/上一值',
        description: '上一次上报的数据值',
        dataType: 'geoPoint',
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
        ],
        metrics: [],
      },
    ],
  },
  {
    column: 'lng',
    name: '经度',
    fullName: '经度',
    description: '属性',
    dataType: 'geoPoint',
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
    ],
    metrics: [],
    children: [
      {
        column: 'properties.lng.last',
        name: '上一值',
        fullName: '经度/上一值',
        description: '上一次上报的数据值',
        dataType: 'geoPoint',
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
