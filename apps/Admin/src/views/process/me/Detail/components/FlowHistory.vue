
<template>
   <div>
      <j-timeline>
         <j-timeline-item>
            <div class="title">
               <div>发起流程</div>
               <div>2023.06.02 16:12:28</div>
            </div>
            <div class="items">
               <div class="item">
                  <div><AIcon type="UserOutlined" /></div>
                  <div class="text">发起人</div>
                  <j-tag color="processing">发起申请</j-tag>
               </div>
            
            </div>
         </j-timeline-item>
         <j-timeline-item>审批节点</j-timeline-item>
         <j-timeline-item>办理节点</j-timeline-item>
      </j-timeline>
   </div>
</template>

<script setup lang='ts'>



</script>

<style scoped lang='less'>
.title{
   display: flex;
   width: 100%;
   justify-content: space-between;
   font-size: 18px;
}
.items{
  padding-top: 12px;
   .item{
      display: flex;
      .text{
         margin: 0 12px;
      }
   }
}
</style>