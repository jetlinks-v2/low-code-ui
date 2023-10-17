<!-- 表格表单预览 -->
<template>
  <j-table :data-source="dataSource" :columns="columns" :pagination="false">
    <template #bodyCell="{ column, text, record }">
      <j-input-number v-if="column.componentType === 'input-number'" />
      <j-select v-else-if="column.componentType === 'select'" :options="[]" />
      <j-switch
        v-else-if="column.componentType === 'switch'"
        v-model:checked="test"
      />
      <Org
        v-else-if="column.componentType === 'org'"
        v-model:value="test"
        style="width: 100%"
      />
      <Role
        v-else-if="column.componentType === 'role'"
        v-model:value="test"
        style="width: 100%"
      />
      <j-input v-else="column.componentType === 'input'" />
    </template>
  </j-table>
</template>

<script setup lang="ts">
import Org from '@/components/FormDesigner/components/Components/Org.vue'
import Role from '@/components/FormDesigner/components/Components/Role.vue'

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

const test = ref(undefined)
</script>

<style lang="less" scoped></style>
