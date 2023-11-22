<template>
  <j-input v-bind=props   v-model:value="_value"   @change="valueChange" :prefix="prefix.type === 'string' ? prefix.content : ''" :suffix="suffix.type === 'string' ? suffix.content : ''">
    <template #prefix v-if="prefix.type === 'icon'">
        <AIcon :type="prefix.content"></AIcon>
    </template>
    <template #suffix  v-if="suffix.type === 'icon'">
        <AIcon :type="suffix.content"></AIcon>
    </template>
  </j-input>
</template>

<script lang="ts" setup>
const props = defineProps({
    value:{
        type:String,
        default:''
    },
    disabled:{
        type:Boolean,
        default:false
    },
    maxlength:{
        type:Number,
    },
    placeholder:{
        type:String,
        default:''
    },
    prefix:{
        type:Object,
        default:{
            type:'',
            content:''
        }
    },
    suffix:{
        type:Object,
        default:{
            type:'',
            content:''
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