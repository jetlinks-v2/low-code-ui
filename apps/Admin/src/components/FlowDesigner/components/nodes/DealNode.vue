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
    header-bgc="#caf982"
    header-icon="SendOutlined"
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
  if (props.config.props.shouldAdd) {
    return '由发起人指定'
  } else if (props.config.props.assignedUser.length > 0) {
    let texts = []
    props.config.props.assignedUser.forEach((org) => texts.push(org.name))
    return String(texts).replaceAll(',', '、')
  } else {
    return ''
  }
})

//校验数据配置的合法性
const validate = (err) => {
  showError.value = false
  if (props.config.props.shouldAdd) {
    showError.value = false
  } else if (props.config.props.assignedUser.length === 0) {
    showError.value = true
    errorInfo.value = '请选择需要抄送的人员'
  }
  if (showError.value) {
    err.push(`抄送节点 ${props.config.name} 未设置抄送人`)
  }
  return !showError.value
}
</script>

<style scoped></style>
