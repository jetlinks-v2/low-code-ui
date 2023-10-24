<!-- 根节点 -->
<template>
  <Node
    title="发起申请"
    :is-root="true"
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

const content = computed(() => {
  if (props?.config?.props?.assignedUser.length) {
    let texts: string[] = []
    props.config.props.assignedUser.forEach((item) => texts.push(item.name))
    return String(texts).replaceAll(',', '、')
  } else {
    return '系统自动匹配参与人'
  }
})
</script>

<style scoped></style>
