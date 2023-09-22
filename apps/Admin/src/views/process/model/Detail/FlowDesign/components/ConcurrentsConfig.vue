<!-- 并行分支配置 -->
<template>
  <j-tabs v-model:activeKey="activeKey" type="card">
    <j-tab-pane key="basic" tab="基础配置">
      <j-form ref="basicFormRef" :model="basicFormData" layout="vertical">
        <j-form-item name="forms">
          <template #label>
            请配置从并行分支进入下一个流程节点的条件
            <j-tooltip placement="right">
              <template #title>
                并行分支中任意一个节点办理人选择了退回后，
                不需要等待其他节点的处理意见，立刻退回至对应节点
              </template>
              <AIcon type="InfoCircleOutlined" />
            </j-tooltip>
          </template>
          <j-radio-group
            v-model:value="basicFormData.forms"
            button-style="solid"
          >
            <j-radio-button value="node">全部分支完成</j-radio-button>
            <j-radio-button value="end">部分分支完成</j-radio-button>
          </j-radio-group>
        </j-form-item>
      </j-form>
    </j-tab-pane>
  </j-tabs>
</template>

<script setup lang="ts">
const activeKey = ref('basic')
const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
})

// 基础配置
const basicFormRef = ref()
const basicFormData = ref({
  forms: [],
})
</script>

<style lang="less" scoped></style>
