<!-- 处理节点配置 -->
<template>
  <j-tabs v-model:activeKey="activeKey" type="card">
    <j-tab-pane key="basic" tab="基础配置" forceRender>
      <j-form ref="basicFormRef" :model="basicFormData" layout="vertical">
        <h3>表单配置</h3>
        <j-form-item
          label="请确认当前节点需要候选人办理的表单内容"
          name="formBinds"
          :rules="[{ required: true, message: '请配置表单内容' }]"
        >
          <ConfigureForm v-model:value="basicFormData.formBinds" />
        </j-form-item>
      </j-form>
    </j-tab-pane>
    <j-tab-pane key="member" tab="成员配置" forceRender>
      <j-form ref="memberFormRef" :model="memberFormData" layout="vertical">
        <h3>候选人配置</h3>
        <j-form-item
          label="请选择可参与办理的候选成员"
          name="candidates"
          :rules="[{ required: true, message: '请选择成员' }]"
        >
          <ConfigureMembers v-model:members="memberFormData.candidates" />
        </j-form-item>

        <h3 style="margin-top: 20px">成员权限</h3>
        <j-form-item
          label="办理成员可以使用哪些按钮"
          name="authButtons"
          :rules="[{ required: true, message: '请选择按钮' }]"
        >
          <j-checkbox-group
            v-model:value="memberFormData.authButtons"
            :options="allButtons"
          />
        </j-form-item>
        <j-form-item label="办理成员可以自由选择下一节点办理人" name="freeChoiceUser">
          <j-switch
            size="small"
            v-model:checked="memberFormData.freeChoiceUser"
          ></j-switch>
        </j-form-item>
      </j-form>
    </j-tab-pane>
  </j-tabs>
</template>

<script setup lang="ts">
import ConfigureForm from './ConfigureForm.vue'
import { findNodeById } from './utils'
import { useFlowStore } from '@/store/flow'

const flowStore = useFlowStore()

const activeKey = ref('basic')
const props = defineProps({
  node: {
    type: Object,
    default: () => ({}),
  },
})
// 基础配置
const basicFormRef = ref()
const basicFormData = reactive({
  formBinds: props.node?.props?.formBinds || {},
})

// 成员配置
const memberFormRef = ref()
const memberFormData = reactive({
  candidates: props.node?.props?.candidates, // 候选人配置
  authButtons: props.node?.props?.authButtons,
  freeChoiceUser: props.node?.props?.freeChoiceUser,
})

// watch(
//   () => memberFormData,
//   (val) => {
//     console.log('memberFormData: ', val)
//   },
//   { deep: true },
// )

const allButtons = ref([{ label: '提交', value: 'submit' }])
const nodeList = ref([
  { label: '审批节点', value: 'approval' },
  { label: '处理节点', value: 'deal' },
])

/**
 * 将数据保存至pinia
 */
const saveConfigToPinia = () => {
  return new Promise((resolve, reject) => {
    basicFormRef.value
      ?.validate()
      .then((valid1) => {
        memberFormRef.value
          ?.validate()
          .then((valid2) => {
            const result = findNodeById(
              flowStore.model.nodes,
              flowStore.selectedNode.id,
            )
            result.props = {
              ...result.props,
              ...basicFormData,
              ...memberFormData,
            }
            resolve({ ...valid1, ...valid2 })
          })
          .catch((err) => {
            reject(err)
          })
      })
      .catch((err) => {
        reject(err)
      })
  })
}
defineExpose({
  saveConfigToPinia,
})
</script>

<style lang="less" scoped></style>
