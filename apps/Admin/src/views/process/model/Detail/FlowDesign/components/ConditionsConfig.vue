<!-- 条件分支配置 -->
<template>
  <j-tabs v-model:activeKey="activeKey" type="card">
    <j-tab-pane key="basic" tab="基础配置">
      <j-form ref="basicFormRef" :model="basicFormData" layout="vertical">
        <j-form-item label="多个条件满足时" name="forms">
          <j-radio-group
            v-model:value="basicFormData.forms"
            button-style="solid"
          >
            <j-radio-button value="node">所有条件下的流程通过</j-radio-button>
            <j-radio-button value="end">部分条件下的流程通过</j-radio-button>
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
