<template>
  <a-select v-model:value="selectData" :open="false" :showArrow="false" @focus="showModal" :options="selectOptions"   :mode="mode" :disabled="disabled">
  </a-select>
  <UserChoice v-if="modalVisible" @closeModal="closeModal" @selectedUser="selectedUser" :selected="selectData" :mode="mode"></UserChoice>
</template>

<script lang="ts" setup>
import UserChoice from './UserChoice.vue'
import { getUser_PaginateNot } from '@/api/form'
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

const selectData:any = ref([]);
const modalVisible = ref(false)
const selectOptions = ref([]);
const showModal = () =>{
  modalVisible.value = true
}
const closeModal = () =>{
  modalVisible.value = false
}

const selectedUser = (data:any) =>{
  modalVisible.value = false
  emit('update:value',data)
}

const queryUser = () =>{
  getUser_PaginateNot({
    paging: false
  }).then((res:any)=>{
    if(res.status === 200){
      selectOptions.value = res.result.map((item:any)=>{
        return {
          label:item.name,
          value:item.id
        }
      })
    }
  })
}
queryUser()

watch(()=>props.value,()=>{
  selectData.value = props.value
})
</script>
<style lang="less" scoped>
</style>