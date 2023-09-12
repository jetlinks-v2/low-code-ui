<template>
  <Node
    title="发起申请"
    :is-root="true"
    :content="content"
    @selected="emits('selected')"
    @insertNode="(type) => emits('insertNode', type)"
    placeholder="系统自动匹配参与人"
    header-bgc="#aaaaaa"
    header-icon="UserOutlined"
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

const content = computed(() => {
  if (props?.config?.props?.assignedUser.length > 0) {
    let texts = []
    props.config.props.assignedUser.forEach((org) => texts.push(org.name))
    return String(texts).replaceAll(',', '、')
  } else {
    return '系统自动匹配参与人'
  }
})
</script>

<style scoped></style>
