
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
                  <div class="top">
                     <AIcon type="UserOutlined" />
                     <div class="text">发起人</div>
                     <j-tag color="processing">发起申请</j-tag>
                  </div>

               </div>
            </div>
         </j-timeline-item>
         <j-timeline-item>
            <div class="title">
               审批节点
            </div>
            <div class="items">
               <div class="item">
                  <div class="top">
                     <AIcon type="UserOutlined" />
                     <div class="text">审批人</div>
                     <j-tag :color="colorMap.get('success')">通过</j-tag>
                     <j-tag :color="colorMap.get('default')">权重</j-tag>
                  </div>
                  <div>2023.06.02 16:12:28</div>
               </div>
               <div><j-input /></div>
            </div>
            <div class="items">
               <div class="item">
                  <div class="top">
                     <AIcon type="UserOutlined" />
                     <div class="text">审批人</div>
                     <j-tag :color="colorMap.get('success')">通过</j-tag>
                     <j-tag :color="colorMap.get('default')">权重</j-tag>
                  </div>
                  <div>2023.06.02 16:12:28</div>
               </div>
               <div><j-input /></div>
            </div>
         </j-timeline-item>
         <j-timeline-item>办理节点</j-timeline-item>
      </j-timeline>
   </div>
</template>

<script setup lang='ts'>

const colorMap = new Map()
colorMap.set('processing','processing')
colorMap.set('success','success')
colorMap.set('error','error')
colorMap.set('default','default')


</script>

<style scoped lang='less'>
.title {
   display: flex;
   width: 100%;
   justify-content: space-between;
   font-size: 18px;
}

.items {
   padding-top: 12px;

   .item {
      display: flex;
      justify-content: space-between;

      .top {
         display: flex;
         margin-bottom: 5px;
      }

      .text {
         margin: 0 12px;
      }
   }
}
</style>