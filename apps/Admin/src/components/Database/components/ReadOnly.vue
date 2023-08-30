<template>
  <j-checkbox v-model:checked="myValue" @change="change" />
</template>

<script setup name="ReadOnly">
const props = defineProps({
  value: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:value'])

const myValue = ref(false)

const change = (e) => {
  myValue.value = e.checked
  emit('update:value', !myValue.value)
}

watch( () => props.value, () => {
  myValue.value = !props.value
}, { immediate: true })
</script>

<style scoped>

</style>
