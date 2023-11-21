<template>
  <div><j-button>{{ text }}</j-button></div>
</template>

<script lang="ts" setup>
const props = defineProps({
    text: {
        type: String,
        default: ''
    },
})
</script>