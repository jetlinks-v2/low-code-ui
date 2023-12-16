<template>
  <j-button @click="visible = true">配置</j-button>
  <Modal v-if="visible" :id="id" :warp="warp" @save="onSave" @cancel="onCancel" />
</template>

<script setup name="SettingConfig">
import Modal from './settingModal.vue'

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  },
  warp: {
    type: Object,
    default: undefined
  },
  id: {
    type: String,
    default: undefined
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
