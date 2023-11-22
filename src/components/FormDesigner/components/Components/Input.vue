<template>
  <j-input v-bind=props   v-model:value="_value"   @change="valueChange" :prefix="prefix.text" :suffix="suffix.text">
    <template #prefix v-if="prefix.icon">
        <AIcon :type="prefix.icon"></AIcon>
    </template>
    <template #suffix  v-if="suffix.icon">
        <AIcon :type="suffix.icon"></AIcon>
    </template>
  </j-input>
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
    },
    prefix:{
        type:Object,
        default:{
            icon:'',
            text:''
        }
    },
    suffix:{
        type:Object,
        default:{
            icon:'',
            text:''
        }
    },
    addonBefore:{
        type:String,
        default:''
    },
    addonAfter:{
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
:deep(.ant-input-group-addon){
    border: none;
    background-color: #fff;
}

</style>