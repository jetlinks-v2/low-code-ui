<template>
  <j-button @click="visible = true">配置</j-button>
  <ModalConfig
    v-if="visible"
    :value="value"
    @save="save"
    @cancel="cancel"
  />
</template>

<script setup name="RenderConfig">
import ModalConfig from './renderModal.vue'

const props = defineProps({
  value: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['update:value'])

const visible = ref(false)

const cancel = () => {
  visible.value = false
}

const save = (v) => {
  console.log(v)
  emit('update:value', v)
  cancel()
}

</script>

<style scoped>

</style>
