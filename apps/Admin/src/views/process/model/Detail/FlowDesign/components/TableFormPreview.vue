<!-- 表格表单预览 -->
<template>
  <j-table :data-source="dataSource" :columns="columns" :pagination="false">
    <template #bodyCell="{ column, text, record }">
      <j-input-number
        v-if="column.type === 'input-number'"
        :disabled="column.componentProps.disabled"
      />
      <j-select
        v-else-if="column.type === 'select'"
        :options="[]"
        :disabled="column.componentProps.disabled"
      />
      <j-switch
        v-else-if="column.type === 'switch'"
        v-model:checked="test"
        :disabled="column.componentProps.disabled"
      />
      <Org
        v-else-if="column.type === 'org'"
        v-model:value="test"
        style="width: 100%"
        :disabled="column.componentProps.disabled"
      />
      <Role
        v-else-if="column.type === 'role'"
        v-model:value="test"
        :disabled="column.componentProps.disabled"
        style="width: 100%"
      />
      <j-input
        v-else="column.type === 'input'"
        :disabled="column.componentProps.disabled"
      />
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
