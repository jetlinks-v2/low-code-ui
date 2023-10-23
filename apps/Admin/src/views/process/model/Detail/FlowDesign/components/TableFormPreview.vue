<!-- 表格表单预览 -->
<template>
  <j-table :data-source="myDataSource" :columns="columns" :pagination="false">
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

type Emits = {
  (e: 'update:dataSource', data: any[]): void
}

const emits = defineEmits<Emits>()
const props = defineProps({
  dataSource: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
})

const myDataSource = ref<any>()

watch(
  () => props.dataSource,
  (val) => {
    myDataSource.value = val
  },
  { deep: true, immediate: true },
)
watch(
  () => myDataSource.value,
  (val) => {
    emits('update:dataSource', val)
  },
  { deep: true, immediate: true },
)
</script>

<style lang="less" scoped></style>
