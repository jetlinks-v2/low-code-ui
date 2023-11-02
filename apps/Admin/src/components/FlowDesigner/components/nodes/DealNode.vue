<!-- 处理节点 -->
<template>
  <node
    :title="config.name"
    :show-error="showError"
    :content="content"
    :error-info="errorInfo"
    :style="style"
    :active="active"
    @selected="emits('selected')"
    @delNode="emits('delNode')"
    @insertNode="(type) => emits('insertNode', type)"
    placeholder="请设置办理人"
    header-bgc="#4FC971"
    header-icon="CarryOutOutlined"
  />
</template>

<script setup lang="ts" name="DealNode">
import Node from './Node.vue'

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
  const { formBinds, candidates, authButtons } = props.config.props

  showError.value = true
  errorInfo.value = '未填写必填配置项'
  if (!name) {
    err.push({
      errors: ['办理节点名称不能为空'],
      name: ['name'],
    })
  }
  // 表单默认勾选"读"权限, 此处不做校验
  //   else if (!formBinds || !Object.keys(formBinds).length) {
  //     err.push({
  //       errors: ['请确认当前节点需要候选人办理的表单内容'],
  //       name: ['formBinds'],
  //     })
  //   }
  else if (
    !candidates ||
    !Object.keys(candidates).length ||
    Object.values(candidates).every((item: any) => !item.length)
  ) {
    err.push({
      errors: ['请选择可参与审批的候选成员'],
      name: ['candidates'],
    })
  } else if (name.length > 64) {
    err.push({
      errors: ['办理节点名称最多输入64个字符'],
      name: ['name'],
    })
    errorInfo.value = '配置项错误'
  } else {
    showError.value = false
    errorInfo.value = ''
  }
}

defineExpose({ validate })

//校验数据配置的合法性
// const validate = (err) => {
//   showError.value = false
//   if (props.config.props.shouldAdd) {
//     showError.value = false
//   } else if (props.config.props.assignedUser.length === 0) {
//     showError.value = true
//     errorInfo.value = '请选择需要抄送的人员'
//   }
//   if (showError.value) {
//     err.push(`抄送节点 ${props.config.name} 未设置抄送人`)
//   }
//   return !showError.value
// }
</script>

<style scoped></style>
