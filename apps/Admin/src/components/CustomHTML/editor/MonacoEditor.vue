<script setup lang="ts">
// import type _typescript from './codeHint/typscript'
 const props = defineProps<{
  value: string,
  filename: string
}>()
const emit = defineEmits<{ (e: 'change', code: string): void }>()

defineOptions({
  editorType: 'monaco',
})

// console.log(_typescript)
const code = ref(props.value)
const onChange = (code: string) => {
  emit('change', code)
}
</script>

<template>
  <j-monaco-editor v-model="code"  @change="onChange" language="vue"/>
</template>
