<template>
    <page-container>
        <j-tabs v-model:activeKey="activeKey" type="card">
            <j-tab-pane key="datacp" tab="表结构">
                <tablecp></tablecp>
            </j-tab-pane>
            <j-tab-pane key="tablecp" tab="数据">
                <datacp></datacp>
            </j-tab-pane>
            <j-tab-pane key="configcp" tab="高级配置">
                <configcp></configcp>
            </j-tab-pane>
            <template #rightExtra>
                <j-button :size="'small'" @click="verifyData">校验</j-button>
            </template>
        </j-tabs>
    </page-container>
</template>
<script lang="ts" setup name="adus" >
import datacp from './datacp/index.vue'
import tablecp from './tablecp/index.vue'
import configcp from './configcp/index.vue'
const activeKey = ref('configcp')
const verifyData = () => {
    console.log('校验');
}
</script>
<style lang="less" scoped></style>