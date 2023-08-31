<template>
   <j-tree-select :tree-data="data" :value="_value" @change="valueChange" :multiple="mode ==='multiple'" :disabled="disabled">
    </j-tree-select>
</template>

<script lang="ts" setup>
import { getRoleList } from '@/api/form'
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
      return {
        label: item.groupName,
        value: item.groupId,
        disabled: true,
        children: item?.roles?.map((i:any)=>{
            return {
                label:i.name,
                value:i.id
            }
        })
      }
    })
} 
const { data,run } = useRequest(getRoleList,{
    onSuccess(res){
        return dealTreeData(res.result)
    },
    immediate:false
})
run({sorts:[{
        name:"createTime",
        order:"desc"
}]})
watch(()=>props.value,()=>{
    _value.value = props.value
},{deep:true,immediate:true})
</script>
<style lang="less" scoped>
</style>