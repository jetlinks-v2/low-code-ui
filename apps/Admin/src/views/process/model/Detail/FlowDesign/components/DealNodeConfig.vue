<!-- 处理节点配置 -->
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
        </j-collapse>
      </j-form>
    </j-tab-pane>
    <j-tab-pane
      key="member"
      tab="成员配置"
      forceRender
      v-if="flowStore.selectedNode.type !== 'ROOT'"
    >
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
              label="请选择可参与办理的候选成员"
              name="candidates"
              :rules="[
                { required: true, message: '请选择成员' },
                { validator: isSelectMember, trigger: 'change' },
              ]"
            >
              <ConfigureMembers
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
                通过权重
                <j-tooltip placement="right">
                  <template #title>
                    “提交”的办理成员权重总和达到设定值时，办理节点通过
                  </template>
                  <AIcon type="InfoCircleOutlined" />
                </j-tooltip>
              </template>
              <j-input-number
                :min="1"
                :max="99999"
                v-model:value="memberFormData.completeWeight"
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
              label="办理成员可以使用哪些按钮"
              name="authButtons"
              :rules="[{ required: true, message: '请选择按钮' }]"
            >
              <j-checkbox-group
                v-model:value="memberFormData.authButtons"
                :options="allButtons"
                disabled
              />
            </j-form-item>
            <j-form-item
              label="办理成员可以自由选择下一节点办理人"
              name="freeChoiceUser"
            >
              <j-switch
                size="small"
                v-model:checked="memberFormData.freeChoiceUser"
                :checkedValue="checkValue"
                :unCheckedValue="undefined"
                @change="handleSwitchChange"
              ></j-switch>
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
  findBranchLastNode,
} from './utils'
import { useFlowStore } from '@/store/flow'
import { onlyMessage } from '@jetlinks/utils'

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
})
const collapseActive = ref(['1', '2', '3'])
// 成员配置
const memberFormRef = ref()
const memberFormData = reactive({
  candidates: props.node?.props?.candidates, // 候选人配置
  completeWeight: props.node?.props?.completeWeight,
  authButtons: props.node?.props?.authButtons || ['submit'],
  freeChoiceUser: props.node?.props?.freeChoiceUser,
})
const allButtons = ref([{ label: '提交', value: 'submit' }])

// 选中的值默认为下一个节点的id
const checkValue = computed(() => {
  let _result
  const _currentNode = flowStore.selectedNode
  // 当前节点属于分支内部节点, 并且为分支最后一个节点
  let _isLastNode = false
  if (_currentNode.props.branchBy) {
    _isLastNode = _currentNode.id === findBranchLastNode(_currentNode).id
  }
  if (_currentNode.props.branchBy && _isLastNode) {
    // 分支上的办理节点, 并且为该分支最后一个节点,
    // 则判断整个分支的children(空节点).children是否为审批节点
    const _branchNode = findNodeById(
      flowStore.model.nodes,
      _currentNode.props.branchBy,
    )
    // 分支节点的子节点(空节点)
    const _emptyNode = _branchNode.children
    // 分支空节点后的节点为审批节点, 开关默认值为此节点的id
    if (_emptyNode?.children?.type === 'APPROVAL') {
      _result = _emptyNode.children.id
    }
  } else {
    // 非分支上的办理节点, 或者分支上的非最后一个节点, 开关默认值为下个审批节点的id
    if (_currentNode?.children?.type === 'APPROVAL') {
      _result = _currentNode.children.id
    }
  }

  return _result
})


const handleSwitchChange = () => {
  const _currentNode = flowStore.selectedNode
  // 通用条件: 当前办理节点不存在子节点或者子节点非审批节点
  const _globalCondition = Boolean(
    !_currentNode.children ||
      !Object.keys(_currentNode.children).length ||
      _currentNode.children.type !== 'APPROVAL',
  )
  // 当前节点属于分支内部节点, 并且为分支最后一个节点
  let _isLastNode = false
  if (_currentNode.props.branchBy) {
    _isLastNode = _currentNode.id === findBranchLastNode(_currentNode).id
  }

  if (_currentNode.props.branchBy && _isLastNode) {
    // 分支上的办理节点, 并且为该分支最后一个节点,
    // 则判断整个分支的children(空节点).children是否为审批节点
    const _branchNode = findNodeById(
      flowStore.model.nodes,
      _currentNode.props.branchBy,
    )
    // 分支节点的子节点(空节点)
    const _emptyNode = _branchNode.children
    if (
      !_emptyNode.children ||
      !Object.keys(_emptyNode.children).length ||
      _emptyNode.children.type !== 'APPROVAL'
    ) {
      onlyMessage('下一节点为审批节点时可配置', 'warning')
      memberFormData.freeChoiceUser = undefined
    }
  } else {
    // 非分支上的办理节点, 或者分支上的非最后一个节点, 正常判断
    if (_globalCondition) {
      onlyMessage('下一节点为审批节点时可配置', 'warning')
      memberFormData.freeChoiceUser = undefined
    }
  }
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
    result.props = {
      ...result.props,
      ...basicFormData,
      ...memberFormData,
    }
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
  saveConfigToStore,
  validateConfig,
})
</script>

<style lang="less" scoped></style>
