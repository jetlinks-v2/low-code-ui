<script setup lang="ts">
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
</script>

<template>
  <j-monaco-editor v-model="code"  @change="onChange" language="html"/>
</template>
