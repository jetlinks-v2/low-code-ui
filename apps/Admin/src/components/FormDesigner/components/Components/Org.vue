<template>
    <j-tree-select :tree-data="treeData" v-model:value="_value" @change="valueChange" :multiple="mode === 'multiple'" :disabled="disabled">
    </j-tree-select>
</template>

<script lang="ts" setup>
import { getDepartmentList_api } from '@/api/user'
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

const valueChange = () =>{
    emit('update:value',_value.value)
}
const treeData = ref();
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
const getTreeData = () =>{
    getDepartmentList_api().then((res:any)=>{
        if(res.status === 200 && res.result){
         treeData.value = dealTreeData(res.result)
        }
    })
}
getTreeData()
watch(()=>props.value,()=>{
    _value.value = props.value
})


</script>
<style lang="less" scoped>
</style>