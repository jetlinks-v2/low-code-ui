<script setup lang="ts" name="MonacoEditorCopy">
import { ref, watch } from 'vue'

const props = defineProps({
  filename: String,
  value: String,
  lang: { type: String, default: 'dark' },
  theme: { type: String, default: 'vs-dark' },
  codeTips: { type: Array, default: [] },
})
const emit = defineEmits(['change'])

const editorValue = ref()

watch(
  () => props.value,
  (newValue) => {
    !newValue && (editorValue.value = newValue)
  },
)

watch(editorValue, () => {
  emit('change', editorValue.value)
})
</script>
<template>
  <j-monaco-editor
    v-model="editorValue"
    :langurage="lang"
    :theme="theme"
    :codeTips="codeTips"
  />
</template>

<style scoped>
.editor {
  height: 100%;
  width: 100%;
}
</style>
