<template>
    <j-cascader :options="geoList"  :value="_value" @change="changeValue" :disabled="disabled" changeOnSelect :showSearch="{filter}">     
    </j-cascader>
</template>

<script lang="ts" setup>
import { cloneDeep,debounce } from 'lodash-es';
const props = defineProps({
    value:{
        type:String,
        default:''
    },
    disabled:{
        type:Boolean,
        default:false
    }
})
const emit = defineEmits(['update:value'])
const geoList = ref()
const _value  = ref()
const changeValue = (value) =>{
    emit('update:value',value)
}

watch(()=>props.value,()=>{
    _value.value = props.value
},{
    deep:true,
    immediate:true
})
</script>
<style lang="less" scoped>
</style>