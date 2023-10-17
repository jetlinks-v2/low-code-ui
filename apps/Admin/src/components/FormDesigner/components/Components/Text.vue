<template>
    <span :style="style">{{ _value }}</span>
</template>

<script lang="ts" setup>
import { computed } from "vue"

const props = defineProps({
    value: {
        type: String,
        default: ''
    },
    style: {
        type: Object,
        default: () => {}
    }
})

const _value = computed(() => {
    return props.value
})
</script>