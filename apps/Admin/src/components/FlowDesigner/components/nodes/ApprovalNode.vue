<!-- 审批节点 -->
<template>
  <Node
    :title="config.name"
    :show-error="showError"
    :content="content"
    :error-info="errorInfo"
    :style="style"
    :active="active"
    @selected="emits('selected')"
    @delNode="emits('delNode')"
    @insertNode="(type) => emits('insertNode', type)"
    placeholder="请设置审批人"
    header-bgc="#FCAB34"
    header-icon="UserOutlined"
  />
</template>

<script setup lang="ts" name="ApprovalNode">
import { computed, ref } from 'vue'
import Node from './Node.vue'
import { useFlowStore } from '@/store/flow'

const flowStore = useFlowStore()

const emits = defineEmits(['selected', 'delNode', 'insertNode'])
const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
})

const showError = ref(false)
const errorInfo = ref('')

const active = computed(() => props?.config?.active)
const style = computed(() => props?.config?.props?.style)
const content = computed(() => {
  const config = props.config.props
  let result: any[] = []
  Object.keys(config.candidates).forEach((key) => {
    if (config.candidates[key].length) {
      result = [...result, ...config.candidates[key]]
    }
  })
  const _names = result.map((item) => item.name)
  return _names.length ? String(_names).replaceAll(',', '、') : '未配置'
})

/**
 * 校验节点
 */
const validate = (err) => {
  const { name } = props.config
  // 节点配置信息校验
  const {
    formBinds,
    candidates,
    completeWeight,
    rejectWeight,
    authButtons,
    endProcessWhenReject,
    gotoWhenReject,
    rejectTo,
    others,
  } = props.config.props

  showError.value = true
  errorInfo.value = '未填写必填配置项'
  if (!name) {
    err.push({
      errors: ['审批节点名称不能为空'],
      name: ['name'],
    })
  } else if (name.length > 64) {
    err.push({
      errors: ['审批节点名称最多输入64个字符'],
      name: ['name'],
    })
  } else if (!formBinds || !Object.keys(formBinds).length) {
    // err.push({
    //   errors: ['请确认当前节点需要候选人办理的表单内容'],
    //   name: ['formBinds'],
    // })
  } else if (others.defaultComment.length > 64) {
    err.push({
      errors: ['审批意见默认值最多输入64个字符'],
      name: ['others', 'defaultComment'],
    })
  } else if (
    !candidates ||
    !Object.keys(candidates).length ||
    Object.values(candidates).every((item: any) => !item.length)
  ) {
    err.push({
      errors: ['请选择可参与审批的候选成员'],
      name: ['candidates'],
    })
  } else if (!completeWeight || !rejectWeight) {
    err.push({
      errors: ['请输入权重'],
      name: ['completeWeight', 'rejectWeight'],
    })
  } else if (!authButtons || !authButtons.length) {
    err.push({
      errors: ['审批成员可以使用哪些按钮'],
      name: ['authButtons'],
    })
  } else if (!endProcessWhenReject && !rejectTo) {
    err.push({
      errors: ['请选择驳回至哪个节点'],
      name: ['gotoWhenReject'],
    })
  } else {
    showError.value = false
    errorInfo.value = ''
  }
}

defineExpose({ validate })

//校验数据配置的合法性
// const validate = (err) => {
//   try {
//     return (showError.value = ![`validate_${props.config.props.assignedType}`](
//       err,
//     ))
//   } catch (e) {
//     return true
//   }
// }
// const validate_ASSIGN_USER = (err) => {
//   if (props.config.props.assignedUser.length > 0) {
//     return true
//   } else {
//     errorInfo.value = '请指定审批人员'
//     err.push(`${props.config.name} 未指定审批人员`)
//     return false
//   }
// }
// const validate_SELF_SELECT = (err) => {
//   return true
// }
// const validate_LEADER_TOP = (err) => {
//   return true
// }
// const validate_LEADER = (err) => {
//   return true
// }
// const validate_ROLE = (err) => {
//   if (props.config.props.role.length <= 0) {
//     errorInfo.value = '请指定负责审批的系统角色'
//     err.push(`${props.config.name} 未指定审批角色`)
//     return false
//   }
//   return true
// }
// const validate_SELF = (err) => {
//   return true
// }
// const validate_FORM_USER = (err) => {
//   if (props.config.props.formUser === '') {
//     errorInfo.value = '请指定表单中的人员组件'
//     err.push(`${props.config.name} 审批人为表单中人员，但未指定`)
//     return false
//   }
//   return true
// }
// const validate_REFUSE = (err) => {
//   return true
// }
</script>

<style scoped></style>
