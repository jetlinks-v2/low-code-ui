
<template>
   <div>
     <FlowDesigner  :nodesData="nodesData" readOnly />
   </div>
  </template>

  <script setup>
  import FlowDesigner from '@LowCode/components/FlowDesigner'
  const props = defineProps({
   info:{
      type:String,
      default:{}
   }
  })
  const  nodesData = ref()
  watchEffect(()=>{
   // console.log(JSON.parse(props.info?.modelContent)?.nodes)
   const nodes = JSON.parse(props.info?.modelContent)?.nodes
   nodesData.value = {
      ...nodes,
      props:{
         ...nodes.props,
         creatorName:props.info.creatorName
      }
   }
  })

  </script>

  <style scoped lang='less'>

  </style>
