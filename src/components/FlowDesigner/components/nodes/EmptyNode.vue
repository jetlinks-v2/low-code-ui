<!-- 空节点 -->
<template>
  <node :show="false" @insertNode="(type) => emits('insertNode', type)" />
</template>

<script setup lang="ts" name="EmptyNode">
import Node from './Node.vue'

const emits = defineEmits(['insertNode'])
provide('isEmptyNode', true)
</script>

<style scoped></style>
