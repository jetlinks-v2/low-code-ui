<template>
  <j-modal
    visible
    :title="title"
    :height="height || 500"
    :width="width || 600"
    @ok="save"
    @cancel="cancel"
  >
    <j-monaco-editor
      v-model="myValue"
      :language="language"
    />

  </j-modal>
</template>

<script setup name="EditorModal">
import { defaultProps } from './data'

const props = defineProps({
  ...defaultProps()
})

const emit = defineEmits(['save', 'cancel'])

const myValue = ref(props.value)

const title = computed(()=>props.language==='javascript'?'交互事件':'样式配置')

const cancel = () => {
  emit('cancel')
}

const save = () => {
  emit('save', myValue.value)
}

</script>

<style scoped>
</style>
