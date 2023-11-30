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

const emit = defineEmits(['update:value', 'change'])

const myValue = ref(false)

const change = (e) => {
  myValue.value = e.target.checked
  emit('update:value', !myValue.value)
  emit('change', !myValue.value)
}

watch( () => props.value, () => {
  myValue.value = !props.value
}, { immediate: true })
</script>

<style scoped>

</style>
