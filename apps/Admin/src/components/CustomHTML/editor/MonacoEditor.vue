<script setup lang="ts">
import Monaco from './monaco/Monaco.vue'

 const props = defineProps<{
  value: string,
  filename: string
}>()
const emit = defineEmits<{ (e: 'change', code: string): void }>()

defineOptions({
  editorType: 'monaco',
})

const code = ref(props.value)
const onChange = (code: string) => {
  emit('change', code)
}

// watch(
//   code,
//   (code: string) => {
//     onChange(code)
//   },
//   { immediate: true },
// )
</script>

<template>
  <Monaco
    @change="onChange"
    :filename="filename"
    :value="code"
  />
  <!-- <j-monaco-editor v-model="code" :lang="lang"/> -->
</template>
