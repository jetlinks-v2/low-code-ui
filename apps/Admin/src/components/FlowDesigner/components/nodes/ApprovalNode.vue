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
  return '未配置'
  //   switch (config?.assignedType) {
  //     case 'ASSIGN_USER':
  //       if (config.assignedUser.length > 0) {
  //         let texts = []
  //         config.assignedUser.forEach((org) => texts.push(org.name))
  //         return String(texts).replaceAll(',', '、')
  //       } else {
  //         return '请指定审批人'
  //       }
  //     case 'SELF':
  //       return '发起人自己'
  //     case 'SELF_SELECT':
  //       return config.selfSelect.multiple ? '发起人自选多人' : '发起人自选一人'
  //     case 'LEADER_TOP':
  //       return '多级主管依次审批'
  //     case 'LEADER':
  //       return config.leader.level > 1
  //         ? '发起人的第 ' + config.leader.level + ' 级主管'
  //         : '发起人的直接主管'
  //     case 'FORM_USER':
  //       if (!config.formUser || config.formUser === '') {
  //         return '表单内联系人（未选择）'
  //       } else {
  //         let text = getFormItemById(config.formUser)
  //         if (text && text.title) {
  //           return `表单（${text.title}）内的人员`
  //         } else {
  //           return '该表单已被移除😥'
  //         }
  //       }
  //     case 'ROLE':
  //       if (config.role.length > 0) {
  //         return String(config.role).replaceAll(',', '、')
  //       } else {
  //         return '指定角色（未设置）'
  //       }
  //     default:
  //       return '未知设置项😥'
  //   }
})

// const getFormItemById = (id) => {
//   return flowStore.model.formItems.find((item) => item.id === id)
// }

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
const validate_SELF_SELECT = (err) => {
  return true
}
const validate_LEADER_TOP = (err) => {
  return true
}
const validate_LEADER = (err) => {
  return true
}
const validate_ROLE = (err) => {
  if (props.config.props.role.length <= 0) {
    errorInfo.value = '请指定负责审批的系统角色'
    err.push(`${props.config.name} 未指定审批角色`)
    return false
  }
  return true
}
const validate_SELF = (err) => {
  return true
}
const validate_FORM_USER = (err) => {
  if (props.config.props.formUser === '') {
    errorInfo.value = '请指定表单中的人员组件'
    err.push(`${props.config.name} 审批人为表单中人员，但未指定`)
    return false
  }
  return true
}
const validate_REFUSE = (err) => {
  return true
}
</script>

<style scoped></style>
