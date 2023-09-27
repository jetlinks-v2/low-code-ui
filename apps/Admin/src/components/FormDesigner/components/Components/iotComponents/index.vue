<template>
  <div>
    <j-button type="primary" @click="visible=true" :disabled="disabled">{{ type === 'product' ? '产品选择' : '设备选择' }}</j-button>
    <SelectModal v-if="visible" @close="closeModal" @update-data="updateData" :select="selectIds"></SelectModal>
    <div class="select">
      <div v-for="(item) in selectData" :key="item?.id" class="selectItem">
        <div v-if="item.name">{{ item.name }}</div>
        <div v-else>{{  item.id }}</div>
        <div @click="cancelSelect(item.id)"><AIcon type="CloseOutlined" class="selectItemIcon" /></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SelectModal from './modal.vue'
import { queryProductNoPage , queryDeviceNoPage } from '@/api/form';
import { cloneDeep } from 'lodash-es'
const props = defineProps({
  value:{
    type:[Array || String],
    default:[] || ''
  },
  disabled:{
    type:Boolean,
    default:false
  }
})

const type = inject('type')
const mode = inject('mode')
const emit = defineEmits(['updateValue'])
const selectIds:any = ref([])
const selectData = ref<any>([])
const visible =ref(false)
const closeModal = () =>{
  visible.value = false
}
const updateData = (data:any) =>{
  visible.value = false
  mode === 'multiple' ? emit('updateValue',data) : emit('updateValue',data?.[0])
}
const cancelSelect = (id: string)=>{
  const index = selectData.value.findIndex((item: any) => item?.id === id)
  selectIds.value.splice(index,1)
  selectData.value.splice(index,1)
} 
// 查询设备|产品接口获取对应id的名称 如果没有则显示id
const queryName =async (data:any) =>{
  const params = {
    paging:false,
    terms:[
      {
        terms:[{
          type:'or',
          value:data,
          termType:'in',
          column:'id'
        }]
      }
    ]
  } 
  let req
  if(type === 'product'){
    req =await queryProductNoPage(params)
  }else{
    req =await queryDeviceNoPage(params)
  }
  if(req.status === 200){
    const array = cloneDeep(selectIds.value)
    selectData.value = array.map((item:any)=>{
     const _data = req.result.find((x:any)=>(x.id === item))
     if(_data){
      return {
        name: _data.name,
        id: item.id
      }
     }else{
      return {
        id:item
      }
     }
    })
  }else{
    const array = cloneDeep(selectIds.value)
    selectData.value = array.map((item:any)=>{
      return {
        id:item
      }
    })
  }
}
watch(()=>props.value,()=>{
  if(props.value?.length){
    selectIds.value = mode === 'multiple' ? props.value : [props.value]
    queryName(props.value)
  }else{
    selectIds.value = []
  }
},{deep:true,immediate:true})
</script>
<style lang="less" scoped>
.select{
  margin: 8px 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .selectItem{
    background-color: #F3F3F3;
    border: none;
    margin-bottom: 6px;
    border-radius: 8px;
    padding: 2px 8px;
    margin-right: 10px;
    color: #333333;
    font-size: 12px;
    display: flex;
    gap: 10px;
    .selectItemIcon {
      color: #333333;
      font-size: 10px;
    }
  }
}
</style>