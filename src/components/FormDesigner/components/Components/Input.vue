<template>
  <j-input v-model:value="_value" :placeholder="placeholder" @change="valueChange"></j-input>
</template>

<script lang="ts" setup>
const props = defineProps({
    value:{
        type:String,
        default:''
    },
    placeholder:{
        type:String,
        default:''
    }
})
const emit = defineEmits(['update:value'])
const _value = ref()
const valueChange = ()=>{
    emit('update:value',_value.value)
}
watch(()=>props.value,(val)=>{
    _value.value = val
},{
    deep:true,
    immediate: true
})
</script>
<style lang="less" scoped>
</style>