
<template>
   <a-drawer visible :closable="false" @close="emit('close')" :get-container="false">
      {{ props.data.name }}简介
   </a-drawer>
</template>

<script setup lang='ts' name="FileDrawer">

const props = defineProps({
   data: {
      type: Object,
      default: {}
   },
})
const emit = defineEmits(['close'])

</script>

<style scoped lang='less'>

</style>