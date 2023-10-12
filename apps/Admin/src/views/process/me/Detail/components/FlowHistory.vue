
<template>
   <div>
      <j-timeline>
         <j-timeline-item v-for=" item in timelines">
            <div class="title">
               <div>{{ nodeTypeMap.get(item.nodeType) }}</div>
               <div v-if="item.nodeState">节点状态</div>
            </div>
            <div class="items">
               <div class="top"></div>
               <div class="item">
                  <div class="item-left">
                     <AIcon type="UserOutlined" />
                     <div class="text">{{ item.operator.name }}</div>
                     <j-tag :color="colorMap.get(item.actionColor)">{{ actionType.get(item.actionType) }}</j-tag>
                     <j-tag :color="'default'" v-if="item.others.weight">权重{{ item.others.weight }}</j-tag>
                  </div>
                  <div class="item-right">{{ dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss') }}</div>
               </div>
               <div v-if="item.changed">
                  <div v-for="e in item.changed">
                     <j-input v-if="e.action === 'taskCommentChanged'"></j-input>
                     <a v-else @click="''">查看办理详情</a>
                  </div>
               </div>
            </div>
         </j-timeline-item>
      </j-timeline>
   </div>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs';

const colorMap = new Map()
colorMap.set('todo', 'processing')
colorMap.set('completed', 'success')
colorMap.set('rejected', 'error')
colorMap.set('default', 'processing')

const typeMap = new Map()
typeMap.set('todo', '待办')
typeMap.set('completed', '已完成')
typeMap.set('rejected', '已拒绝')


const nodeTypeMap = new Map()
nodeTypeMap.set('ROOT', '发起流程')
nodeTypeMap.set('APPROVAL', '审批节点')
nodeTypeMap.set('DEAL', '办理节点')
//网关节点
nodeTypeMap.set('CONDITIONS', '条件组')
nodeTypeMap.set('CONCURRENTS', '并行节点组')
nodeTypeMap.set('EMPTY', '空节点')
//不是网关节点
nodeTypeMap.set('CONDITION', '条件子分支')

const actionType = new Map()
actionType.set('sign', '签收')
actionType.set('pass', '通过')
actionType.set('auto', '自动通过')
actionType.set('error', '驳回')
actionType.set('initiate', '发起申请')


const props = defineProps({
   info: {
      type: Object,
      default: {}
   },
})

const timelines = ref<any>([])
const modal = ref(new Map())
const task = ref(new Map())


//节点类型
const handleModal = (obj) => {
   for (let key in obj) {
      modal.value.set(obj.id, obj.type)
      if (obj.children && typeof obj.children === 'object') {
         handleModal(obj.children)
      }
      break;
   }
}
//任务节点
const handleTask = (arr) => {
   arr?.forEach(item => {
      task.value.set(item.id, {
         nodeId: item.nodeId,
         nodeProvider: item.nodeProvider
      })
   })
   console.log(task.value)
}
//判断分支节点
const handleBranch = (item) => {
   // console.log(task.value.get(item.taskId)?.nodeProvider,modal.value.get(task.value.get(item.taskId)?.nodeId))
   return task.value.get(item.taskId)?.nodeProvider === 'gateway' && ['CONDITIONS', 'CONCURRENTS', 'EMPTY'].includes(modal.value.get(task.value.get(item.taskId)?.nodeId))
}

//判断节点是否在时间线上
const filterLine = (item, index) => {
   const nodeType = modal.value.get(task.value.get(item.taskId)?.nodeId)
   if (item.action === 'taskAddLink' && item.others.type === 'assignee') {
      return {
         ...item,
         nodeType: nodeType,
         actionType: 'sign',
         actionColor: 'default',
         show: true
      }
   } else if (item.action === 'taskLinkChanged') {
      //完成
      if (item.others.afterState === 'completed' || item.others.afterState === 'rejected') {
         return {
            ...item,
            nodeType: nodeType,
            actionType: item.others.afterState === 'completed' ? 'pass' : 'error',
            actionColor: item.others.afterState === 'completed' ? 'completed' : 'error',
            show: true,
         }
      }

      //判断分支节点
   } else if (item.action === 'taskStateChanged') {

      if (item.others.afterState === 'completed' || item.others.afterState === 'rejected') {
         return {
            ...item,
            nodeType: nodeType,
            actionType: item.others.afterState === 'completed' ? 'pass' : 'error',
            actionColor: item.others.afterState === 'completed' ? 'completed' : 'error',
            show: handleBranch(item),
            isBranch: handleBranch(item),
            branchStartIndex: handleBranch(item) ? index : undefined,
            branchEndIndex: nodeType === 'EMPTY' ? index : undefined
         }
      }
   } else {
      return {
         ...item,
         show: false,
      }
   }


}

//处理评论及变表单变动
const handleChange = (arr) => {
   const showList = arr.filter(i => i.show)
   const noShowList = arr.filter(i => !i.show)

   const result = showList.map(item => {

      const arr = noShowList.filter(e => {
         if (e.action === 'taskCommentChanged' || e.action === 'formAdd' || e.action === 'formUpdate') {
            return e.traceId === item.traceId
         }
      })
      if (arr) {
         return {
            ...item,
            changed: arr
         }
      }
      return item
   })
   console.log('change----------', showList, noShowList, result)
   return result

}

//处理时间轴
const handleTimelines = () => {
   const arr: any = []
   props.info.timelines?.forEach((item, index) => {
      //默认第一节点
      if (index === 0) {
         arr.push({
            ...item,
            nodeType: 'ROOT',
            actionType: 'initiate',
            actionColor: 'default'
         })
      } else {
         const obj = filterLine(item, index)
         if (obj) {
            arr.push(obj)
         }
      }
   });
   timelines.value = handleChange(arr)
   // console.log('arr--------', arr,handleChange(arr))

   // timelines.value = arr
}

onMounted(() => {
   // console.log('timelines', props.info.timelines)
   // console.log('props.info', props.info)
   handleModal(JSON.parse(props.info.modelContent)?.nodes)

   handleTask(props.info.tasks)
   handleTimelines()
})

</script>

<style scoped lang='less'>
.title {
   display: flex;
   width: 100%;
   justify-content: space-between;
   font-size: 18px;
}

.items {
   margin-top: 5px;

   .top {
      display: flex;
      justify-content: space-between;
   }

   .item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;

      .item-left {
         display: flex;
         align-items: center;

         .text {
            margin: 0 5px;
         }
      }


   }
}
</style>