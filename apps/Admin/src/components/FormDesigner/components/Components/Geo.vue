<template>
    <j-cascader :options="geoList"  v-model:value="_value" @change="changeValue" :disabled="disabled" changeOnSelect :showSearch="{filter}">     
    </j-cascader>
</template>

<script lang="ts" setup>
import { cloneDeep,debounce } from 'lodash-es';
import Geo from '../../../../../public/json/geo.json'
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
//处理前端geo数据
const getList = (list:any,parentName?:string) =>{
   return list.map((item:any)=>{
        const optionValue = parentName ? parentName + '-' + item.name : item.name
        if(item?.districts?.length){
           const children = getList(item.districts,optionValue)
           return {
            label:item.name,
            value:optionValue,
            children:children
           }
        }else{
            return {
                label:item.name,
                value:optionValue
            }
        }
    })
}
const filter = (inputValue, path) => {
  return path.some(option => option.value.includes(inputValue));
}
const changeValue = () =>{
    emit('update:value',_value.value)
}
onMounted(()=>{ 
    const list = cloneDeep(Geo)
    geoList.value = getList(list)
})
watch(()=>props.value,()=>{
    _value.value = props.value
})
</script>
<style lang="less" scoped>
</style>