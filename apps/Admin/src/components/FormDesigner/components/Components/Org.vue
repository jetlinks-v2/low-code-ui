<template>
    <j-tree-select :tree-data="data" :value="_value" @change="valueChange" :multiple="mode === 'multiple'" :disabled="disabled">
    </j-tree-select>
</template>

<script lang="ts" setup>
import { getDepartmentList_api } from '@/api/user'
import { useRequest } from '@jetlinks/hooks';
const props = defineProps({
    value:{
        type:Array,
        default:[]
    },
    mode:{
        type:String,
        default:''
    },
    disabled:{
        type:Boolean,
        default:false
    }
})
const emit = defineEmits(['update:value'])

const _value = ref()

const valueChange = (value:any) =>{
    emit('update:value',value)
}
const dealTreeData = (tree:any)=>{
    return tree.map((item:any)=>{
        if(item?.children){
            return {
                label:item?.name,
                value:item?.id,
                children: dealTreeData(item.children)
            }
        }else{
            return {
                label:item?.name,
                value:item?.id
            }
        }   
    })
} 
const { data  } =useRequest(getDepartmentList_api,{
    onSuccess(res){
        return dealTreeData(res.result)
    }
})

watch(()=>props.value,()=>{
    _value.value = props.value
},{deep:true,immediate:true})


</script>
<style lang="less" scoped>
</style>