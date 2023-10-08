
<template>
   <page-container>
      <div class="header">
         <div v-for="item in types" :class="{'item':true,'active':item.key===activeKey}" @click="onClick(item.key)">{{ item.value }}</div>
      </div>
      <div class="content">
         <Content :active-key="activeKey"/>
      </div>
   </page-container>
</template>

<script setup >
import Content from './content.vue'

const types = [
   { key: 'wait', value: '代办事项' },
   { key: 'already', value: '已办事项' },
   { key: 'initiate', value: '我发起的' },
   { key: 'copy', value: '抄送给我' },
]

const activeKey = ref('wait')

const onClick = (key)=>{
   activeKey.value = key
}

</script>

<style scoped lang='less'>
   .header{
      display: flex;
      margin-bottom: 20px;
      .item{
         background-color: #FFF;
         height: 30px;
         line-height: 30px;
         padding: 0 12px;
         margin-right: 24px;
         cursor: pointer;
         &.active {
            background-color: #3174f1;
            border-radius: 4px;
            color: #FFF;
        }
      }

   }
</style>