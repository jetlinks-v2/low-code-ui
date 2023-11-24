<template>
  <div>
    <j-button @click="visible = true">配置</j-button>
    <Modal v-if="visible" @cancel="onClose" @save="onSave" />
  </div>
</template>

<script setup name="DataSource">
import Modal from './dataSourceModal.vue'

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:value'])

const visible = ref(false)

const onClose = () => {
  visible.value = false
}

const onSave = (data) => {
  emit('update:value', data)
  onClose()
}



</script>

<style scoped>

</style>
