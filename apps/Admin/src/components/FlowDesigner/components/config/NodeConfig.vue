<template>
  <a-tabs v-model:activeKey="activeKey" type="card">
    <a-tab-pane key="basic" tab="基础配置">基础配置</a-tab-pane>
    <a-tab-pane key="member" tab="成员配置">成员配置</a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
import { useFlowStore } from '@/store/flow'

const flowStore = useFlowStore()
const selectedNode = computed(() => flowStore.selectedNode)

const activeKey = ref('basic')
</script>

<style lang="less" scoped></style>
