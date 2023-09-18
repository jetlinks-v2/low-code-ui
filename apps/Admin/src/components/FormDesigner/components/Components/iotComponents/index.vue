<template>
  <div>
    <j-button type="primary" @click="visible=true" :disabled="disabled">{{ type === 'product' ? '产品选择' : '设备选择' }}</j-button>
    <SelectModal v-if="visible" @close="closeModal" @update-data="updateData" :select="selectData"></SelectModal>
    <div class="select">
      <j-tag v-for="(item) in selectData" :key="item.id" closable @close="cancelSelect(item.id)" class="selectItem">
        {{ item.name }}
      </j-tag>
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
const selectData = ref()
const visible =ref(false)
const closeModal = () =>{
  visible.value = false
}
const updateData = (data:any) =>{
  visible.value = false
  emit('updateValue',data)
}
const cancelSelect = (id:string)=>{
  const index = selectData.value.includes(id)
  selectData.value.splice(index,1)
} 
watch(()=>props.value,()=>{
  selectData.value = props.value
},{deep:true,immediate:true})
</script>
<style lang="less" scoped>
.select{
  margin-top: 8px;
  width: 100%;
  .selectItem{
    background-color: #F3F3F3;
    border: none;
    margin-bottom: 6px;
    border-radius: 8px;
    padding: 2px 8px;
    color: #333333;
    font-size: 12px;
  }
}
</style>