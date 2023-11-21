<!-- 审批节点配置 -->
<template>
  <j-tabs v-model:activeKey="activeKey" type="card">
    <j-tab-pane key="basic" tab="基础配置" forceRender>
      <j-form ref="basicFormRef" :model="basicFormData" layout="vertical">
        <j-collapse
          v-model:activeKey="collapseActive"
          expand-icon-position="right"
          :bordered="false"
        >
          <j-collapse-panel key="1">
            <template #header>
              <TitleComponent data="表单配置"></TitleComponent>
            </template>
            <j-form-item
              label="请确认当前节点需要候选人办理的表单内容"
              name="formBinds"
            >
              <!-- :rules="[{ required: true, message: '请配置表单内容' }]" -->
              <ConfigFormFields v-model:value="basicFormData.formBinds" />
            </j-form-item>
          </j-collapse-panel>
          <j-collapse-panel key="2">
            <template #header>
              <TitleComponent data="节点控制"></TitleComponent>
            </template>
            <j-form-item name="autoComplete">
              <template #label>
                <j-space>
                  自动通过
                  <j-tooltip placement="right">
                    <template #title>
                      某候选人在上一个审批/办理节点中担任过审批人角色，开启后其在当前节点的审批意见为自动通过
                    </template>
                    <AIcon type="InfoCircleOutlined" />
                  </j-tooltip>
                </j-space>
              </template>
              <j-switch
                size="small"
                v-model:checked="basicFormData.autoComplete"
              ></j-switch>
            </j-form-item>
            <j-form-item label="审批意见必填" name="dealRequired">
              <j-switch
                size="small"
                v-model:checked="basicFormData.dealRequired"
              ></j-switch>
            </j-form-item>
            <j-form-item
              label="审批意见默认值"
              :name="['others', 'defaultComment']"
              :rules="[{ max: 64, message: '最多输入64个字符' }]"
            >
              <j-input
                v-model:value="basicFormData.others.defaultComment"
                placeholder="请输入审批意见默认值"
              />
            </j-form-item>
          </j-collapse-panel>
        </j-collapse>
      </j-form>
    </j-tab-pane>
    <j-tab-pane key="member" tab="成员配置" forceRender>
      <j-form ref="memberFormRef" :model="memberFormData" layout="vertical">
        <j-collapse
          v-model:activeKey="collapseActive"
          expand-icon-position="right"
          :bordered="false"
        >
          <j-collapse-panel key="1">
            <template #header>
              <TitleComponent data="候选人配置"></TitleComponent>
            </template>
            <j-form-item
              label="请选择可参与审批的候选成员"
              name="candidates"
              :rules="[
                { required: true, message: '请选择成员' },
                { validator: isSelectMember, trigger: 'change' },
              ]"
            >
              <ConfigureMembers
                ref="memberRef"
                v-model:members="memberFormData.candidates"
                :nodeId="flowStore.selectedNode.id"
              />
            </j-form-item>
          </j-collapse-panel>
          <j-collapse-panel key="2">
            <template #header>
              <TitleComponent data="权重控制"></TitleComponent>
            </template>
            <j-form-item
              name="completeWeight"
              :rules="[{ required: true, message: '请输入通过权重' }]"
            >
              <template #label>
                <j-space>
                    通过权重
                    <j-tooltip placement="right">
                      <template #title>
                        审批意见为“通过”的成员权重总和达到设定值时，审批通过
                      </template>
                      <AIcon type="InfoCircleOutlined" />
                    </j-tooltip>
                </j-space>
              </template>
              <j-input-number
                :min="1"
                :max="99999"
                v-model:value="memberFormData.completeWeight"
                :precision="0"
                :defaultValue="1"
                style="width: 100%"
              />
            </j-form-item>
            <j-form-item
              name="rejectWeight"
              :rules="[{ required: true, message: '请输入驳回权重' }]"
            >
              <template #label>
                <j-space>
                    驳回权重
                    <j-tooltip placement="right">
                      <template #title>
                        审批意见为“驳回”的成员权重总和达到设定值时，审批驳回
                      </template>
                      <AIcon type="InfoCircleOutlined" />
                    </j-tooltip>
                </j-space>
              </template>
              <j-input-number
                :min="1"
                :max="99999"
                v-model:value="memberFormData.rejectWeight"
                :precision="0"
                style="width: 100%"
              />
            </j-form-item>
          </j-collapse-panel>
          <j-collapse-panel key="3">
            <template #header>
              <TitleComponent data="成员权限"></TitleComponent>
            </template>
            <j-form-item
              label="审批成员可以使用哪些按钮"
              name="authButtons"
              :rules="[{ required: true, message: '请选择按钮' }]"
            >
              <j-checkbox-group
                v-model:value="memberFormData.authButtons"
                :options="allButtons"
              />
            </j-form-item>
            <j-form-item
              label="驳回配置"
              name="endProcessWhenReject"
              :rules="[{ required: true, message: '请选择驳回配置' }]"
              v-if="memberFormData.authButtons.includes('reject')"
            >
              <j-radio-group
                v-model:value="memberFormData.endProcessWhenReject"
                button-style="solid"
              >
                <j-space>
                  <j-radio-button :value="false">驳回至节点</j-radio-button>
                  <j-radio-button :value="true">结束流程</j-radio-button>
                </j-space>
              </j-radio-group>
            </j-form-item>
            <j-form-item
              label="请选择驳回至哪个节点"
              name="rejectTo"
              :rules="[{ required: true, message: '请选择驳回至哪个节点' }]"
              v-if="
                memberFormData.authButtons.includes('reject') &&
                !memberFormData.endProcessWhenReject
              "
            >
              <j-select
                v-model:value="memberFormData.rejectTo"
                :options="nodeList"
                showSearch
              />
            </j-form-item>
          </j-collapse-panel>
        </j-collapse>
      </j-form>
    </j-tab-pane>
  </j-tabs>
</template>

<script setup lang="ts">
import ConfigFormFields from './ConfigFormFields.vue'
import {
  findNodeById,
  setDefaultFormBinds,
  isSelectMember,
  handleFormList,
} from './utils'
import { useFlowStore } from '@LowCode/store/flow'

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
  //   formBinds:
  //     props.node?.props?.formBinds ||
  //     setDefaultFormBinds(flowStore.model.config?.forms),
//   formBinds: setDefaultFormBinds(
//     handleFormList(flowStore.model.config.forms?.map((i) => i.fullInfo)),
//     props.node?.props?.formBinds,
//   ),
  formBinds: props.node?.props?.formBinds,
  autoComplete: props.node?.props?.autoComplete,
  dealRequired: props.node?.props?.dealRequired,
  others: props.node?.props?.others || { defaultComment: '同意' },
})
const collapseActive = ref(['1', '2', '3'])

// 成员配置
const memberRef = ref()
const memberFormRef = ref()
const memberFormData = reactive({
  candidates: props.node?.props?.candidates,
  completeWeight: props.node?.props?.completeWeight,
  rejectWeight: props.node?.props?.rejectWeight,
  authButtons: props.node?.props?.authButtons || ['pass', 'reject'],
  endProcessWhenReject: props.node?.props?.endProcessWhenReject || false,
  gotoWhenReject: props.node?.props?.gotoWhenReject,

  // 前端使用
  rejectTo: props.node?.props?.gotoWhenReject[0] || undefined,
})
const allButtons = ref([
  { label: '通过', value: 'pass', disabled: true },
  { label: '驳回', value: 'reject' },
])
const nodeList = ref<{ label: string; value: string }[]>([
  //   { label: '审批节点', value: 'approval' },
  //   { label: '处理节点', value: 'deal' },
])

/**
 * 驳回的节点
 * 获取当前节点之前的所有审批和办理节点
 */
const getRejectNodes = (nodeId) => {
  const _parentNode = findNodeById(flowStore.model.nodes, nodeId)
  if (_parentNode.type && ['ROOT', 'APPROVAL', 'DEAL'].includes(_parentNode.type)) {
    nodeList.value.push({ label: _parentNode.name, value: _parentNode.id })
  }
  // 父节点存在, 并且可以驳回的节点没有找到 继续查找
  if (_parentNode?.parentId) getRejectNodes(_parentNode.parentId)
  memberFormData.rejectTo = memberFormData.rejectTo
    ? memberFormData.rejectTo
    : nodeList.value?.[0]?.value
}

/**
 * 将数据保存至store, 不用校验合法性
 */
const saveConfigToStore = () => {
  return new Promise((resolve, reject) => {
    const result = findNodeById(
      flowStore.model.nodes,
      flowStore.selectedNode.id,
    )
    if (!basicFormData.others.defaultComment) {
      delete basicFormData.others.defaultComment
    }
    const { rejectTo, ...others } = memberFormData
    others.gotoWhenReject = [rejectTo]
    // #19514
    // result.props = {
    //   ...result.props,
    //   ...basicFormData,
    //   ...others,
    // }
    Object.assign(result.props, basicFormData, others)
    console.log('result.props: ', result.props)
    console.log('result: ', result)
    // #19583
    // result = {
    //   ...result,
    //   props: {
    //     ...result.props,
    //     ...basicFormData,
    //     ...others,
    //   },
    // }
    resolve(result)
  })
}

/**
 * 校验配置数据
 */
const validateConfig = () => {
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
            // result.props = {
            //   ...result.props,
            //   ...basicFormData,
            //   ...memberFormData,
            // }
            // #19573
            if (!basicFormData.others.defaultComment) {
              delete basicFormData.others.defaultComment
            }
            const { rejectTo, ...others } = memberFormData
            others.gotoWhenReject = [rejectTo]
            Object.assign(result.props, basicFormData, others)
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
const memberSubmit = () => {
  memberRef.value?.submit()
}
defineExpose({
  saveConfigToStore,
  validateConfig,
  memberSubmit,
})
onMounted(() => {
  getRejectNodes(props.node?.parentId)
  if (!nodeList.value.find((item) => item.value === memberFormData.rejectTo)) {
    memberFormData.rejectTo = null
  }
})
</script>

<style lang="less" scoped></style>
