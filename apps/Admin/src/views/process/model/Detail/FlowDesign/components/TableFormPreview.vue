<!-- 表格表单预览 -->
<template>
  <j-table :data-source="dataSource" :columns="columns" :pagination="false">
    <template #bodyCell="{ column, text, record }">
      <component
        :is="componentMap[column.type]"
        :data="record"
        v-model:value="record[column.dataIndex]"
        :disabled="column.componentProps.disabled"
      />
    </template>
  </j-table>
</template>

<script setup lang="ts">
import componentMap from '@/components/FormDesigner/utils/componentMap'

defineProps({
  dataSource: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
})
</script>

<style lang="less" scoped></style>
