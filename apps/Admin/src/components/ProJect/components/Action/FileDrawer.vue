
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
      <div>类型：{{ type }} - {{ providerMap, providerEnum[props.data.type] }}</div>
      <div>位置：{{ location }}</div>
      <j-divider></j-divider>
      <div class="title">引用关系：</div>
      <div v-for="item in relation">{{ item }}</div>
   </j-drawer>
</template>

<script setup lang='ts' name="FileDrawer">
import { useProduct } from '@/store'
import { providerMap, providerEnum } from '../../index'
import { cloneDeep } from 'lodash-es';

const product = useProduct()

const props = defineProps({
   data: {
      type: Object,
      default: {}
   },
})
const emit = defineEmits(['close'])
const web = [providerEnum.HtmlPage, providerEnum.FormPage, providerEnum.ListPage, providerEnum.Page]
const location = ref()
const relation = ref<any>()
const dataMap = new Map()

const type = computed(() => {
   if (props.data.type === 'module') {
      return '通用能力'
   } else if (web.includes(props.data.type)) {
      return '前端资源'
   } else {
      return '后端功能'
   }
})

const handleDataMap = (data) => {
   data?.forEach?.(item => {
      const { children, ...extra } = item
      // if( item.id ==='jwQhhpTh2cnw6n5G'){
      //    dataMap.set(item.id, {
      //       ...extra,
      //       others:{
      //          useList:['EnpKsc3yRDmdkxH4']
      //       }
      //    })
      // }else{
      //    dataMap.set(item.id, extra)
      // }
      dataMap.set(item.id, extra)
      if (children?.length) {
         handleDataMap(item.children)
      }
   })
}

const getRelation = () => {
   handleDataMap(cloneDeep(product.data))

   const arr = [...dataMap.values()]
   relation.value = arr.filter(item => item?.others?.useList?.includes(props.data.id))?.map(it => {
      if (it.type === 'module') {
         return `通用能力-${it.title}`
      } else if (web.includes(it.type)) {
         return `前端资源-${it.title}`
      } else {
         return `后端能力-${it.title}`
      }
   })
   // console.log('arr----',arr,relation.value)
}

onMounted(() => {
   // console.log('----------',props.data)
   location.value = product.getParent(props.data).map((item: any) => item.title).join(' -> ')
   getRelation()
})

</script>

<style scoped lang='less'> .title {
    font-size: 22px;
    margin-bottom: 10px;
 }
</style>