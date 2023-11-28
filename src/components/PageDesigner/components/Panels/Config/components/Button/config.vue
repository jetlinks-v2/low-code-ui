<template>
    <div>
      <j-button @click="visible = true">配置</j-button>
      <Modal v-if="visible" @cancel="onClose" @save="onSave" :type="type" :data="value"/>
    </div>
  </template>
  
  <script setup name="Config">
  import Modal from './configModal.vue'
  
  const props = defineProps({ 
    value: {
      type: Object,
      default: () => ({})
    },
    type:{
        type:String,
        default:'Button'
    }
  })
  
  const emit = defineEmits(['update:value','change'])
  
  const visible = ref(false)
  
  const onClose = () => {
    visible.value = false
  }
  
  const onSave = (data) => {
    emit('update:value', data)
    emit('change',data)
    onClose()
  }
  
  
  
  </script>
  
  <style scoped>
  
  </style>
  