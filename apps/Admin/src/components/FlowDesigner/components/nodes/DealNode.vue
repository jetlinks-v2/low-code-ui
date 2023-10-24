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
