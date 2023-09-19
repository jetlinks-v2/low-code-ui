<template>
  <div>
    <j-button type="primary" @click="visible=true" :disabled="disabled">{{ type === 'product' ? '产品选择' : '设备选择' }}</j-button>
    <SelectModal v-if="visible" @close="closeModal" @update-data="updateData" :select="selectData"></SelectModal>
    <div class="select">
      <div v-for="(item) in selectData" :key="item.id" class="selectItem">
        <div>{{ item.name }}</div>
        <div @click="cancelSelect(item.id)"><AIcon type="CloseOutlined" class="selectItemIcon" /></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SelectModal from './modal.vue'
const props = defineProps({
  value:{
    type:Array,
    default:[]
  },
  disabled:{
    type:Boolean,
    default:false
  }
})

const type = inject('type')
const emit = defineEmits(['updateValue'])
const selectData = ref([])
const visible =ref(false)
const closeModal = () =>{
  visible.value = false
}
const updateData = (data:any) =>{
  visible.value = false
  emit('updateValue',data)
}
const cancelSelect = (id: string)=>{
  const index = selectData.value.findIndex((item: any) => item?.id === id)
  selectData.value.splice(index,1)
} 
watch(()=>props.value,()=>{
  selectData.value = props.value
},{deep:true,immediate:true})
</script>
<style lang="less" scoped>
.select{
  margin-bottom: 8px;
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