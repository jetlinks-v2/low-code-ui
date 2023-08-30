<template>
  <div>
    <j-tabs v-model:activeKey="activeKey" :tabBarGutter="0" type="card">
        <j-tab-pane tab="组件库" key="module"><Library/></j-tab-pane>
        <j-tab-pane tab="模板" key="template"><Library/></j-tab-pane>
    </j-tabs>
  </div>
</template>

<script lang="ts" setup>
import Library from "./library";
const activeKey = ref('module')
</script>
<style lang="less" scoped>
:deep(.ant-tabs-tab){
    width: 146px;
}
:deep(.ant-tabs-tab-btn){
        margin: 0 auto;
}
</style>