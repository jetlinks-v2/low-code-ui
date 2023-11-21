
<template>
   <ContextMenu type="project" @select="handleChange" @show="onShow">
      <div class="content">
         <div class="item">
            <div class="item-img">
               <img :src="getImage('/project/mouse.png')">
            </div>
            <div class="item-text">暂无项目</div>
            <div class="item-bottom">你可以点击鼠标右键添加项目能力，快速完成项目搭建</div>
         </div>
         <!-- <a-drawer title="添加项目说明" :closable="false" :visible="showMenu" :style="{ position: 'absolute' }"
            :getContainer="false" @close="showMenu = false" :mask="false">
            <div class="drawer" v-for="items in projectList">
               <div class="drawer-title">{{ items.title }}</div>
               <div class="drawer-items" v-for="item in items.children">
                  <div class="items-img">
                     <img :src="item.img">
                  </div>
                  <div class="items-text">
                     <div class="text">{{ providerMap[item.type] }}</div>
                     <span>{{ item.text }}</span>
                  </div>
               </div>
            </div>
         </a-drawer> -->
      </div>
   </ContextMenu>

   <InputModal v-if="visible" :provider="provider" @close="visible = false" @save="onSave" :name-list="nameList" />
</template>

<script setup lang='ts' name="Empty">
import { getImage } from '@jetlinks-web/utils';
import InputModal from '../components/Action/InputModal.vue'
import { projectList, providerMap } from '../index'
import { useProduct } from '@LowCode/store'
import ContextMenu from '../components/ContextMenu/index.vue'

const product = useProduct()

const props = defineProps({
   data: Object
})

const provider = ref()
const nameList = ref()
const showMenu = ref(false)

const visible = ref<boolean>(false)



const handleChange = (key) => {
   provider.value = key
   visible.value = true
}

const onSave = (data) => {
   product.add(data, data.parentId)
   visible.value = false
}

const onShow = (val) => {
   showMenu.value = val
}

onMounted(() => {
   nameList.value = props.data?.children?.map(item => item.name)
})

</script>

<style scoped lang='less'>
.content {
   height: 100%;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   padding: 0px;
   gap: 32px;

   :deep(.ant-drawer-wrapper-body) {
      background-color: #FAFAFA;

      .ant-drawer-header {
         background-color: #FAFAFA;
      }
   }

   .item {
      width: 380px;
      height: 205px;
      // background-color: #EEE;
      // border: 1px solid #666666;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;

      .item-img {
         width: 123px;
         height: 121px;

         img {
            width: 100%;
            height: 100%;
         }
      }

      .item-text {
         font-size: 24px;
         color: #333333;
         font-weight: normal;
         line-height: 22px;
         letter-spacing: 0px;
         margin-top: 20px;
      }

      .item-bottom {
         font-size: 16px;
         font-weight: normal;
         line-height: 22px;
         letter-spacing: 0px;

         color: #666666;
      }
   }

   .drawer {

      .drawer-title {
         font-size: 14px;
         font-weight: 500;
         line-height: 24px;
         margin: 10px 0;
      }

      .drawer-items {
         height: 64px;
         display: flex;
         background-color: #FFF;
         align-items: center;
         padding: 0 12px;

         .items-img {
            height: 24px;
            width: 24px;

            img {
               width: 100%;
               height: 100%;
            }
         }

         .items-text {
            margin-left: 10px;

            .text {
               font-size: 14px;
               line-height: 14px;
            }

            span {
               color: #666666;
            }
         }
      }
   }
}</style>
