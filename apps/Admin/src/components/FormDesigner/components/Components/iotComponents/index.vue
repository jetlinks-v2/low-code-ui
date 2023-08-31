<template>
  <div>
    <j-button type="primary" @click="visible=true" :disabled="disabled">{{ type === 'product' ? '产品选择' : '设备选择' }}</j-button>
    <SelectModal v-if="visible" @close="closeModal" @update-data="updateData" :select="selectData"></SelectModal>
    <div class="select">
      <div v-for="(item) in selectData" class="selectItem">
        {{ item.name }}
        <AIcon type="CloseOutlined" class="closeIcon" @click="cancelSelect(item.id)"></AIcon>
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
  margin-top: 20px;
  width: 400px;
  .selectItem{
    display: inline-block;
    background-color: rgb(215, 215, 215);
    width: 60px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding:0 10px;
    position: relative;
    margin-left: 20px;
    .closeIcon{
      position: absolute;
      font-size: 10px;
      right: 2px;
      top: 2px
    }
  }
}
</style>