<template>
  <j-button @click="visible = true">{{title}}</j-button>
  <Modal v-if="visible" :id="id" :type="type" :data="value" @save="save" @cancel="cancel" />
</template>

<script setup name="">
import Modal from './Modal.vue'

const props = defineProps({
  title: {
    type: String,
    default: '配置onCreated'
  },
  value: {
    type: String,
    default: undefined,
  },
  type: {
    type: String,
    default: undefined
  },
  id: {
    type: String,
    default: undefined
  }
})

const emits = defineEmits(["update:value", "change"]);

const visible = ref(false)

const save = (data) => {
  emits('update:value', data)
  emits('change', data)
  cancel()
}

const cancel = () => {
  visible.value = false
}

</script>

<style scoped>

</style>
