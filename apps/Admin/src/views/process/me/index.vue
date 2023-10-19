
<template>
   <page-container>
      <div class="header" v-if="type !== 'todo'">
         <div v-for="item in types" :class="{ 'item': true, 'active': item.key === activeKey }" @click="onClick(item.key)">
            {{ item.value }}
         </div>
         <div v-if="type==='initiate'" :class="{ 'draft': true, 'active': 'draft' === activeKey }" @click="onClick('draft')">草稿箱</div>
      </div>
      <div class="content">
         <Content :history="activeKey === 'completed'" :type="type" :activeKey="activeKey"/>
      </div>
   </page-container>
</template>

<script setup >
import Content from './content.vue'
const route = useRoute()

const types = [
   { key: 'running', value: '流转中' },
   { key: 'completed', value: '已完成' },
   // { key: 'daft', value: '草稿箱' }
]

const processType = new Map()
processType.set('todo', '待办事项')
processType.set('finished', '已办事项')
processType.set('cc', '抄送给我')
processType.set('initiate', '我发起的')

const activeKey = ref('running')
const type = ref('')

const onClick = (key) => {
   activeKey.value = key
}

onMounted(() => {
   // console.log('route',route.path)
   const item = route.path?.split('/')
   // console.log(item)
   type.value = item[item.length - 1]
})

</script>

<style scoped lang='less'>
.header {
   display: flex;
   margin-bottom: 20px;

  

   .item {
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

   .draft {
      position: absolute;
      right: 30px;
      cursor: pointer;
      padding: 5px 10px;
      background-color: #FFF;
      border-radius: 4px;
      
      &.active {
         background-color: #3174f1;
         padding:5px 12px;
         border-radius: 4px;
         color: #FFF;
      }
   }
}
</style>