<template>
  <j-button @click="visible = true">配置{{title}}</j-button>
  <Modal v-if="visible" :id="id" :type="type" :data="value" :title="title" @save="save" @cancel="cancel" />
</template>

<script setup name="LifeCycle">
import Modal from './Modal.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'onCreated'
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
