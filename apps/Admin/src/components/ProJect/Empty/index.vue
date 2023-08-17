
<template>
   <div style="margin-left: 10px;">
      <div>自由选配为 {{ props.data?.name }} 项目添加能力，快速完成项目搭建</div>
      <div class="module">
         <div>通用能力</div>
         <div class="module-card" @click="onClick('Module')">
            <div>模块</div>
            <div>使用模块对项目进行分层管理</div>
         </div>
      </div>
      <div class="web">
         <div>前端资源</div>
         <div class="web-card">
            <div style="margin: 0 10px;">
               <div>页面</div>
               <div>快速搭建业务功能页</div>
            </div>
            <div>
               <div @click="onClick('HtmlPage')" style="height: 50px;width: 100px;" class="card-div" >自定义html</div>
               <div @click="onClick('FormPage')" style="height: 95px;width: 100px;margin-top: 5px;" class="card-div">表单页模板</div>
            </div>
            <div style="margin-left: 5px;">
               <div @click="onClick('ListPage')" class="card-div" style="width: 100px;height: 85px;">列表页模板</div>
               <div class="card-div" style="width: 100px;height: 60px;margin-top: 5px;">步骤式弹窗</div>
            </div>
         </div>
      </div>
      <div class="java">
         <div>后端功能</div>
         <div class="java-card">
            <div class="left">
               <div style="display: flex;margin-bottom: 10px;">
                  <div class="card-div" style="height: 60px;" @click="onClick('CRUD')">
                     <span>增删改查</span>
                     <span>用于管理业务数据、提供增删改查等能力</span>
                  </div>
                  <div class="card-div" style="width: 150px;margin-left: 10px;" @click="onClick('SQL')">
                     <span>SQL</span>
                     <span>定制化查询能力</span>
                  </div>
               </div>

               <div style="display: flex;background-color: #fff;">
                  <div class="left-bottom">
                     <div>工作流</div>
                     <div>结合表单页配置业务流转规则</div>
                     <div class="bottom-card" style="width: 150px;height: 50px;margin-top: 10px;">流程表单</div>
                  </div>
                  <div class="bottom-card" style="width: 70px;height: 90px; margin: 10px 0;">流程配置</div>
               </div>
            </div>

            <div class="right"  @click="onClick('Function')">
               <div>函数</div>
               <div>使用脚本自定义业务逻辑</div>
            </div>
         </div>
      </div>
   </div>
   <InputModal v-if="visible" :provider="provider" @close="visible=false" @save="onSave"/>
</template>

<script setup lang='ts' name="Empty">
import InputModal from '../components/Action/InputModal.vue'
import { providerEnum } from '../index'
import { useProduct } from '@/store'

const product = useProduct()

const props = defineProps({
   data: Object
})

const provider = ref()

const visible = ref<boolean>(false)

const onClick = (type: string) => {
   console.log('type',type)
   provider.value = providerEnum[type]
   visible.value = true
}

const onSave = (data)=>{
   product.add(data,data.parentId)
   visible.value = false
}

</script>

<style scoped lang='less'>
.module {
   margin-left: 10px;
   .module-card {
      width: 150px;
      height: 100px;
      background-color: #f2f2f2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      cursor: pointer;

      &:hover {
         background-color: #80ace5;
      }
   }
}

.web {
   margin-left: 10px;
   margin-top: 10px;
   .web-card {
      width: 360px;
      height: 200px;
      background-color: #f2f2f2;
      display: flex;
      align-items: center;
      text-align: center;

      .card-div {
         background-color: rgb(252, 252, 252);
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         border-radius: 5px;
         cursor: pointer;

         &:hover {
            background-color: #80ace5;
         }
      }
   }
}

.java {
   margin-left: 10px;
   margin-top: 10px;
   .java-card {
      width: 500px;
      height: 210px;
      background-color: #f2f2f2;
      display: flex;
      align-items: center;

      .left {
         margin-left: 10px;
         .left-bottom {
            width: 200px;
            margin-right: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
         }

         .bottom-card {
            background-color: #f2f2f2;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            cursor: pointer;


            &:hover {
               background-color: #80ace5;
            }
         }

         .card-div {
            background-color: rgb(252, 252, 252);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            cursor: pointer;

            &:hover {
               background-color: #80ace5;
            }
         }
      }

      .right {
         background-color: rgb(252, 252, 252);
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         border-radius: 5px;
         cursor: pointer;
         width: 230px;
         height: 180px;
         margin: 0 10px;

         &:hover {
            background-color: #80ace5;
         }
      }
   }
}</style>
