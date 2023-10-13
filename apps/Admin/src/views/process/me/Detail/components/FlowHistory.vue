
<template>
   <div>
      <j-timeline>
         <j-timeline-item v-for=" item in timelines">
            <!-- <div class="title">
               <div>{{ item.operator.name }}</div>
            </div> -->
            <div class="items">
               <div class="item">
                  <div class="item-left">
                     <AIcon type="UserOutlined" />
                     <div class="text">{{ item.operator.name }}</div>
                     <j-tag :color="colorMap.get(item.actionColor)">{{ actionType.get(item.actionType) }}</j-tag>
                     <j-tag :color="'default'" v-if="item.others.weight">权重{{ item.others.weight }}</j-tag>
                  </div>
                  <div class="item-right">{{ dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss') }}</div>
               </div>
               <div v-if="item.changed && item.nodeType !== 'ROOT'">
                  <div v-for="e in item.changed" style="margin: 10px;">
                     <a v-if="e.action !== 'taskCommentChanged'"  @click="toDetail(e)">查看办理详情</a>
                     <j-input v-else style="width: 60%;" :value="e.others.afterComment"/>
                  </div>
               </div>
               <div v-if="item.childrenNode" class="item-children">
                  <div style="margin-right: 10px;">{{ item.childrenNode.others.taskName }}</div>
                  <j-tag :color="colorMap.get(item.childrenNode.others.afterState)">
                     {{ typeMap.get(item.childrenNode.others.afterState) }}
                  </j-tag>
               </div>
            </div>
         </j-timeline-item>
      </j-timeline>
   </div>
   <FlowUpdate v-if="visible" :current="current" :info="info" @close="visible = false" />
</template>

<script setup lang='ts'>
import dayjs from 'dayjs';
import FlowUpdate from './FlowUpdate.vue';

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
const visible = ref(false)
const current = ref<any>({})


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
      task.value.set(item.id, item)
   })
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
            show: false,
            // isBranch: handleBranch(item),
            // branchStartIndex: handleBranch(item) ? index : undefined,
            // branchEndIndex: nodeType === 'EMPTY' ? index : undefined
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
         if (item.action === 'taskLinkChanged') {
            if (e.action === 'taskCommentChanged' || e.action === 'formAdd' || e.action === 'formUpdate') {
               return e.traceId === item.traceId
            }
         }
      })
      const childrenNode = noShowList.find(e => {
         if (e.action === 'taskStateChanged' && item.action === 'taskLinkChanged') {
            return e.traceId === item.traceId
         }
      })
      if (arr || childrenNode) {
         return {
            ...item,
            changed: arr,
            childrenNode: childrenNode || item.childrenNode
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
            show: true,
            nodeType: 'ROOT',
            actionType: 'initiate',
            actionColor: 'default',
            childrenNode: {
               others: { taskName: '发起流程', afterState: 'completed' }
            }
         })
      } else {
         const obj = filterLine(item, index)
         if (obj) {
            arr.push(obj)
         }
      }
   });
   timelines.value = handleChange(arr)
   // console.log('arr--------', arr,handleChang-e(arr))
   // timelines.value = arr
}

const toDetail = (val) => {
   current.value = val
   visible.value = true
}

onMounted(() => {
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

   .item-children {
      display: flex;
      background-color: #f3edc640;
      margin-top: 10px;
      padding: 10px 10px;
   }
}
</style>