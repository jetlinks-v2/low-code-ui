<template>
   <j-tree-select :tree-data="treeData" v-model:value="_value" @change="valueChange" :multiple="multiple">
    </j-tree-select>
</template>

<script lang="ts" setup>
import { getRoleList } from '@/api/form'
const props = defineProps({
    value:{
        type:Array,
        default:[]
    },
    multiple:{
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
      return {
        label: item.groupName,
        value: item.groupId,
        disabled: true,
        children: item.roles.map((i:any)=>{
            return {
                label:i.name,
                value:i.id
            }
        })
      }
    })
} 

const getTreeData = () =>{
    getRoleList({sorts:[{
        name:"createTime",
        order:"desc"
    }]}).then((res:any)=>{
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