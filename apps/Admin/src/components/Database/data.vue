<template>
  <div class="crud-warp">
    <j-tabs >
      <j-tab-pane key="1" tab="表结构">
        <DataTable />
      </j-tab-pane>
      <j-tab-pane key="2" tab="数据">

      </j-tab-pane>
      <j-tab-pane key="3" tab="高级配置">

      </j-tab-pane>
      <template #rightExtra>
        <j-button class="extra-check">校验</j-button>
      </template>
    </j-tabs>
  </div>
</template>

<script setup class="CRUDBase">
import DataTable from './table.vue'

</script>

<style scoped lang="less">
.crud-warp {
  .crud-content {
    padding: 0 24px;
  }

  .extra-check {
    margin-right: 24px;
  }
}
</style>
