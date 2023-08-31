<template>
    <Iot :value="_value" :disabled="disabled" @updateValue="updateValue"></Iot>
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
const updateValue = (value:any) =>{
  emit('update:value',value)
}
provide('type','device')
provide('mode',props.mode)
watch(()=>props.value,()=>{
   _value.value = props.value
},{
  deep:true,
  immediate:true
})
</script>
<style lang="less" scoped>
</style>