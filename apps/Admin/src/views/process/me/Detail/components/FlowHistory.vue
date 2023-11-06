
<template>
   <div class="content">
      <j-timeline>
         <j-timeline-item v-for=" (item, index) in timelines" :color="getColor(item,index) ? '#315EFB' : '#999999'">
            <div class="items">
               <div class="item">
                  <div class="item-left">
                     <!-- <AIcon type="UserOutlined" /> -->
                     <div class="item-img">
                        <img :src="getImage('/me/user.svg')">
                     </div>
                     <div class="text">
                        <j-ellipsis>
                           {{ item.operatorName || item.operator.name }}
                        </j-ellipsis>

                     </div>
                     <j-tag :color="colorMap.get(item.actionColor)">
                        {{ actionType.get(item.actionType) }}
                     </j-tag>
                     <!-- <j-tag :color="colorMap.get('completed')" v-if="item.others.autoOperation">
                        {{ actionType.get('auto') }}
                     </j-tag> -->
                     <j-tag :color="'default'" v-if="item.others.weight">权重{{ item.others.weight }}</j-tag>
                  </div>
                  <div class="item-right">{{ dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss') }}</div>
               </div>
               <div v-if="item.changed && item.nodeType !== 'ROOT'">
                  <a v-if="showChanged(item.changed, 'form').length"
                     @click="toDetail(showChanged(item.changed, 'form'))">查看办理详情</a>
                  <div v-if="showChanged(item.changed, 'taskCommentChanged')" class="comment">
                     {{ showChanged(item.changed, 'taskCommentChanged')?.others.afterComment }}
                  </div>
                  <!-- <j-input v-if="showChanged(item.changed,'taskCommentChanged')" style="width: 60%;" :value="showChanged(item.changed,'taskCommentChanged')?.others.afterComment" /> -->
               </div>
               <div v-if="item.childrenNode && !findRejectNode(item.childrenNode?.traceId)" class="item-children" >
                  <div style="margin-right: 10px;">{{ item.childrenNode.others.taskName }}</div>
                  <j-tag
                     :color="colorMap.get(item.childrenNode.others.afterState === 'completed' ? 'children_completed' : 'children_rejected')">
                     {{ typeMap.get(item.childrenNode.others.afterState) }}
                  </j-tag>
               </div>
               <div v-if="item.childrenNode?.others.afterState === 'rejected' && findRejectNode(item.childrenNode?.traceId)" class="item-children">
                  <div style="margin-right: 10px;">
                     {{ item.others.taskName }} 已驳回至 {{ findRejectNode(item.childrenNode?.traceId) }}
                  </div>
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
import { getImage } from '@jetlinks/utils';

const colorMap = new Map()
colorMap.set('todo', 'processing')
colorMap.set('children_completed', 'success')
colorMap.set('children_rejected', 'error')
colorMap.set('reject', '#E50012')
colorMap.set('default', 'processing')
colorMap.set('completed', '#4FC971')
colorMap.set('off', '#99a59c')

const typeMap = new Map()
typeMap.set('todo', '待办')
typeMap.set('completed', '已完成')
typeMap.set('reject', '已驳回')
typeMap.set('rejected', '已驳回')


// const nodeTypeMap = new Map()
// nodeTypeMap.set('ROOT', '发起流程')
// nodeTypeMap.set('APPROVAL', '审批节点')
// nodeTypeMap.set('DEAL', '办理节点')
// //网关节点
// nodeTypeMap.set('CONDITIONS', '条件组')
// nodeTypeMap.set('CONCURRENTS', '并行节点组')
// nodeTypeMap.set('EMPTY', '空节点')
// //不是网关节点
// nodeTypeMap.set('CONDITION', '条件子分支')

const actionType = new Map()
actionType.set('sign', '签收')
actionType.set('pass', '通过')
actionType.set('auto', '自动通过')
actionType.set('reject', '驳回')
actionType.set('submit', '提交')
actionType.set('initiate', '发起申请')
actionType.set('off', '关闭')


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
const isEnd = ref(false)



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
      if (item.nodeProvider === 'endEvent') {
         isEnd.value = true
      }
   })
}

const getColor = (item,index) => {
   // console.log('isend',isEnd.value,timelines.value.length,index,isEnd.value && index === timelines.value.length - 1)
   return isEnd.value && index === timelines.value.length - 1 || item.action === 'processEnd'
}
//判断节点类型
const nodeState = (nodeType, auto) => {
   if (nodeType === 'APPROVAL') {
      return auto ? 'auto' : 'pass'
   }
   if (nodeType === 'DEAL') {
      return 'submit'
   }
   return 'pass'
}


//判断节点是否在时间线上
const filterLine = (item, index) => {
   const nodeType = modal.value.get(task.value.get(item.taskId)?.nodeId)
   if (item.action === 'taskAddLink' && item.others.type === 'assignee') {
      return {
         ...item,
         nodeType: nodeType,
         operatorName: item.others.identity.name,
         actionType: 'sign',
         actionColor: 'completed',
         show: item.others.autoOperation ? false : true
      }
   } else if (item.action === 'taskLinkChanged') {
      //完成
      if (item.others.afterState === 'completed' || item.others.afterState === 'reject') {
         return {
            ...item,
            nodeType: nodeType,
            operatorName: item.others.identity.name,
            actionType: item.others.afterState === 'completed' ? nodeState(nodeType, item.others.autoOperation) : 'reject',
            actionColor: item.others.afterState === 'completed' ? 'completed' : 'reject',
            show: true,
         }
      }

      //判断分支节点
   } else if (item.action === 'taskStateChanged') {

      if (item.others.afterState === 'completed' || item.others.afterState === 'rejected') {
         return {
            ...item,
            nodeType: nodeType,
            operatorName: item.operator.name,
            actionType: item.others.afterState === 'completed' ? 'pass' : 'error',
            // actionColor: item.others.afterState === 'completed' ? 'children_completed' : 'children_rejected',
            show: false,
            // isBranch: handleBranch(item),
            // branchStartIndex: handleBranch(item) ? index : undefined,
            // branchEndIndex: nodeType === 'EMPTY' ? index : undefined
         }
      }
   } else if (item.action === 'processEnd') {
      return {
         ...item,
         actionType: 'off',
         actionColor: 'off',
         show:item.others.state.value==='repealed'? true: false
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
      //评论及表单
      const arr = noShowList.filter(e => {
         if (item.action === 'taskLinkChanged') {
            if (e.action === 'taskCommentChanged' || e.action === 'formAdd' || e.action === 'formUpdate') {
               return e.traceId === item.traceId
            }
         }
      })
      //节点状态
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
//判断展示表单还是评论
const showChanged = (val, type) => {
   const res = val.find(item => item.action === 'taskCommentChanged')
   const resp = val.filter(item => item.action !== 'taskCommentChanged')
   return type === 'taskCommentChanged' ? res : resp
}


//找驳回至的节点
const findRejectNode = (traceId) => {
   const nodeId = props.info.timelines?.find(item => item.action === 'taskFallback' && item.traceId === traceId)?.others.nodeIds?.[0]
   const obj = props.info.tasks?.find(item => item.nodeId === nodeId)
   // console.log('------',nodeId,obj)
   return obj?.nodeName
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
.content {
   :deep(.ant-timeline-item-tail) {
      border-left: 3px solid #999999;
      position: absolute;
      top: 12px;
      left: 4px;
   }

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

            .item-img {
               width: 14px;
               line-height: 16px;
               height: 16px;

               img {
                  width: 100%;
                  height: 100%;
               }
            }

            .text {
               margin: 0 10px;
               color: #000000;
               font-weight: 500;
               font-size: 16px;
               max-width: 350px;
            }
         }

         .item-right {
            color: #9E9E9E;
            font-size: 14px;
         }


      }

      .comment {
         background-color: #FAFAFA;
         margin-top: 10px;
         padding: 10px 10px;
      }

      .item-children {
         display: flex;
         background-color: #F6F9FF;
         margin-top: 10px;
         padding: 10px 10px;
      }
   }
}
</style>