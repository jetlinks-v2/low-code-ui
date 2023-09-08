<script setup lang="ts">
 const props = defineProps<{
  value: string,
  filename: string
}>()
const emit = defineEmits<{ (e: 'change', code: string): void, (e: 'blur'): void }>()

defineOptions({
  editorType: 'monaco',
})

const code = ref(props.value)
const onChange = (code: string) => {
  emit('change', code)
}

const onBlur = () => {
  emit('blur')
}
</script>

<template>
  <j-monaco-editor v-model="code"  @change="onChange" @blur="onBlur" language="html"/>
</template>
