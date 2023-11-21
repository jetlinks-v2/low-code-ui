<template>
  <div>
    <j-tag>{{ text }}</j-tag>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  text: {
    type: String,
    default: '',
  },
})
</script>