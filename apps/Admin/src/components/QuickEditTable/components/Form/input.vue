<template>
  <j-input
    v-model:value="myValue"
    @change="change"
  />
</template>

<script setup name="FormInput">
import { InputProps } from 'ant-design-vue/es/input'

const props = defineProps({
  ...InputProps()
})

const emit = defineEmits(['change'])

const myValue = ref()

const change = (e) => {

}

watch(() => props.value, () => {
  myValue.value = props.value
})

</script>

<style scoped>

</style>
