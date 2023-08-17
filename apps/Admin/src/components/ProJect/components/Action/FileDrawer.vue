
<template>
   <j-drawer visible :closable="false" @close="emit('close')" :get-container="false">
      <div class="title">{{ props.data.name }} 简介</div>
      <div>
         添加时间：{{ props.data.others.createTime }}
      </div>
      <div>
         修改时间：{{ props.data.others.modifyTime }}
      </div>
      <j-divider></j-divider>
      <div class="title">通用：</div>
      <div>类型：{{ type }} - {{ providerMap[props.data.type] }}</div>
      <div>位置：{{ location }}</div>
      <j-divider></j-divider>
      <div class="title">引用关系：</div>
   </j-drawer>
</template>

<script setup lang='ts' name="FileDrawer">
import { useProduct } from '@/store'
import { providerMap} from '../../index'
const product = useProduct()

const props = defineProps({
   data: {
      type: Object,
      default: {}
   },
})
const emit = defineEmits(['close'])
const location = ref()

const type = computed(()=>{
   if(props.data.type === 'module'){
      return '通用能力'
   }else if(['page-html','page-list','page-form'].includes(props.data.type)){
      return '前端资源'
   }else{
      return '后端功能'
   }
})

onMounted(()=>{
   // console.log('----------',props.data)
   location.value = product.getParent(props.data).map((item:any)=>item.title).join(' -> ')
})

</script>

<style scoped lang='less'> 
.title{
   font-size: 22px;
   margin-bottom: 10px;
}
</style>