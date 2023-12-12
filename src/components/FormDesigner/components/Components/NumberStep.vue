<template>
  <div>123</div>
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
})
const emits = defineEmits(['update:value', 'change'])

</script>