<template>
  <Iot v-model:value="_value" :disabled="disabled"></Iot>
</template>

<script lang="ts" setup>
import Iot from './iotComponents/index.vue'
import {  provide } from 'vue'
const props =  defineProps({
  value:{
    type:Array,
    default:[]
  },
  mode:{
    type:String,
    default:''
  },
  disabled:{
    type:Boolean,
    default:false
  }
})
const _value:any = ref([])
const emit = defineEmits(['update:value'])
provide('type','product')
provide('mode',props.mode)
watch(()=>props.value,()=>{
  _value.value = props.value
})
watch(()=>_value.value,()=>{
  emit('update:value',_value.value)
})
</script>
<style lang="less" scoped>
</style>