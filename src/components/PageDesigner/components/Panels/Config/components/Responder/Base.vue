<template>
  <j-button @click="visible = true">配置响应器</j-button>
  <Modal v-if="visible" @save="save" @cancel="cancel" />
</template>

<script setup name="ResponderBase">
import Modal from './Modal.vue'

const visible = ref(false)

const save = () => {
  cancel()
}

const cancel = () => {
  visible.value = false
}
</script>

<style scoped>

</style>
