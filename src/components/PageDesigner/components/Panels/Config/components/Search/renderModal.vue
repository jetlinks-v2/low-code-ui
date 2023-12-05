<template>
  <j-modal
    title="Render配置"
    @cancel="cancel"
    @ok="save"
  >
    <span>function render(record, route, router, h, utils){</span>
    <ProMonaco
      v-model:value="myValue"
    />
    <span>}</span>
  </j-modal>
</template>

<script setup name="RenderModal">
import {ProMonaco} from '../ProMonaco'

const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:value'])

const myValue = ref(props.value)

const save = () => {
  emit('save', myValue.value)
}

const cancel = () => {
  emit('cancel')
}
</script>

<style scoped>

</style>
