<template>
  <div class="filed-box">
    <Scrollbar height="100%">
      <j-tabs :tabBarGutter="0" type="card">
        <j-tab-pane tab="组件库" key="module"><Library /></j-tab-pane>
      </j-tabs>
    </Scrollbar>
  </div>
</template>

<script lang="ts" setup>
import Library from './library'
import { Scrollbar } from 'jetlinks-ui-components'
</script>
<style lang="less" scoped>
.filed-box {
  padding: 12px 6px;
  height: 100%;
}
:deep(.ant-tabs-tab) {
  width: 90px;
}
:deep(.ant-tabs-tab-btn) {
  margin: 0 auto;
}
</style>