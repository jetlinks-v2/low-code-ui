
<template>
   <j-drawer visible :closable="false" @close="emit('close')" :get-container="getContainer"
      :style="{ position: 'absolute' }" :maskStyle="{
         'background-color': '#ffffff00'
      }">
      <div class="title">
         <div class="left"></div>
         <div>
            <j-ellipsis>{{ props.data.name }}简介</j-ellipsis>
         </div>
      </div>
      <div class="content">
         <div class="content-title">添加时间：</div>
         <div class="right">{{ props.data.others.createTime }}</div>
      </div>
      <div class="content">
         <div class="content-title">修改时间：</div>
         <div class="right">{{ props.data.others.modifyTime }}</div>
      </div>
      <div class="content">
         <div class="content-title">类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型:</div>
         <div class="right">{{ type }} - {{ providerMap[props.data.type] }}</div>
      </div>
      <div class="content">
         <div class="content-title">位&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;置:</div>
         <div class="right"> {{ location }}</div>
      </div>
      <j-divider></j-divider>
      <div class="title">
         <div class="left"></div>
         <div>引用关系</div>
      </div>
      <div v-for="item in relation">
         <j-ellipsis>{{ item }}</j-ellipsis>
      </div>
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
   getContainer: {
      type: Boolean,
      default: false
   }
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
         return `通用能力 - ${it.title}`
      } else if (web.includes(it.type)) {
         return `前端资源 - ${it.title}`
      } else {
         return `后端能力 - ${it.title}`
      }
   })
   // console.log('arr----',arr,relation.value)
}

onMounted(() => {
   // console.log('----------',props.data)
   location.value = product.getParent(props.data).map((item: any) => item.title).join(' > ')
   getRelation()
})

</script>

<style scoped lang='less'> .title {
    font-size: 22px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 22px;
    font-size: 16px;
    font-weight: 500;
    color: #333333;

    .left {
       width: 4px;
       min-width: 4px;
       height: 14px;
       border-radius: 1px;
       opacity: 1;
       background: #315EFB;
       margin-right: 5px;
    }
 }

 .content {
    display: flex;
    font-size: 14px;

    .content-title {
       width: 70px;
       text-align: justify;
    }

    .right {
       color: #777777;
       width: 260px;
       word-break: break-all;
    }
 }
</style>