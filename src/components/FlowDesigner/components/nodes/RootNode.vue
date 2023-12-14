<!-- 根节点 -->
<template>
  <!-- title="发起申请" -->
  <Node
    :title="config.name"
    :is-root="true"
    :show-error="showError"
    :error-info="errorInfo"
    :content="content"
    @selected="emits('selected')"
    @insertNode="(type) => emits('insertNode', type)"
    placeholder="系统自动匹配参与人"
    header-bgc="#485468"
    header-icon="icon-a-faqi2"
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
  //   return '系统自动匹配参与人' // #19303
  return props?.config?.props?.creatorName || '系统自动匹配参与人' // #19431
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
  console.log('validate',props.config?.name)
  // if (!props.config.props.assignedUser.length) {
  //   showError.value = true
  //   errorInfo.value = '请在基础信息中配置成员'
  //   err.push({
  //     errors: [errorInfo.value],
  //     name: ['assignedUser'],
  //   })
  // } else {
  //   showError.value = false
  //   errorInfo.value = ''
  // }

  if (!props.config?.name) {
    showError.value = true
    errorInfo.value = '未填写必填配置项'
    err.push({
      errors: [errorInfo.value],
      name: ['assignedUser'],
    })
  } else if (props.config?.name.length > 64) {
    showError.value = true
    errorInfo.value = '配置项错误'
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
