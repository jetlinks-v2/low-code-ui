<!-- 根节点 -->
<template>
  <Node
    title="发起申请"
    :is-root="true"
    :show-error="showError"
    :error-info="errorInfo"
    :content="content"
    @selected="emits('selected')"
    @insertNode="(type) => emits('insertNode', type)"
    placeholder="系统自动匹配参与人"
    header-bgc="#485468"
    header-icon="SendOutlined"
  />
</template>

<script setup lang="ts" name="RootNode">
import Node from './Node.vue'

const emits = defineEmits(['selected', 'insertNode'])
const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
})

const showError = ref(false)
const errorInfo = ref('')

const content = computed(() => {
  if (props?.config?.props?.assignedUser.length) {
    let texts: string[] = []
    props.config.props.assignedUser.forEach((item) => texts.push(item.name))
    return String(texts).replaceAll(',', '、')
  } else {
    return '系统自动匹配参与人'
  }
})

/**
 * 校验节点
 */
const validate = (err) => {
  if (!props.config.props.assignedUser.length) {
    showError.value = true
    errorInfo.value = '请在基础信息中配置成员'
    err.push({
        errors: [errorInfo.value],
        name: ['assignedUser'],
    })
  } else {
    showError.value = false
    errorInfo.value = ''
  }
}

defineExpose({ validate })
</script>

<style scoped></style>
