
<template>
   <div>
     <FlowDesigner  :nodesData="nodesData" readOnly />
   </div>
  </template>
  
  <script setup lang='ts'>
  import FlowDesigner from '@/components/FlowDesigner'
  const props = defineProps({
   info:{
      type:String,
      default:{}
   }
  })
  const  nodesData = ref()
  watchEffect(()=>{
   nodesData.value = JSON.parse(props.info?.modelContent)?.nodes
  })
  </script>
  
  <style scoped lang='less'>
  
  </style>