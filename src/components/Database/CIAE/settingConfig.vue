<template>
  <j-button @click="visible = true">配置</j-button>
  <Modal v-if="visible" @save="onSave" @cancel="onCancel" />
</template>

<script setup name="SettingConfig">
import Modal from './settingModal.vue'

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:value'])

const visible = ref(false)

const onCancel = () => {
  visible.value = false
}

const onSave = (data) => {
  emit('update:value', data)
  onCancel()
}

</script>

<style scoped>

</style>
