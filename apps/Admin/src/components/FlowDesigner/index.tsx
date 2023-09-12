import { cloneDeep } from 'lodash-es'
import {
  defineComponent,
  h,
  getCurrentInstance,
  ComponentInternalInstance,
} from 'vue'
import { useFlowStore } from '@/store/flow'
import './index.less'

// 引入节点组件
import Root from './components/nodes/RootNode.vue'
import Node from './components/nodes/Node.vue'
import Approval from './components/nodes/ApprovalNode.vue'
import Deal from './components/nodes/DealNode.vue'
import Condition from './components/nodes/ConditionNode.vue'
import Empty from './components/nodes/EmptyNode.vue'

import BranchButton from './components/BranchButton.vue'
import DefaultProps from './DefaultNodeProps'
import { onlyMessage } from '@jetlinks/utils'

const componentsMap = {
  NODE: Node,
  ROOT: Root,
  APPROVAL: Approval,
  DEAL: Deal,
  CONDITION: Condition,
  EMPTY: Empty,
}

const FlowDesigner = defineComponent({
  name: 'FlowDesigner',
  props: {
    // 树结构数据
    treeData: {
      type: Object,
      default: () => ({}),
    },
    // 只读模式
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots, emit, expose }) {
    console.log('props: ', props)
    const { proxy } = getCurrentInstance() as ComponentInternalInstance

    const flowStore = useFlowStore()
    const valid = ref(true)

    const nodeMap = computed(() => flowStore.nodeMap)
    const dom = computed(() => flowStore.design?.process)

    const getDomTree = (h, node) => {
      toMapping(node)
      if (isPrimaryNode(node)) {
        //普通业务节点
        let childDoms = getDomTree(h, node.children)
        decodeAppendDom(h, node, childDoms)
        return [h('div', { class: { 'primary-node': true } }, childDoms)]
      } else if (isBranchNode(node)) {
        let index = 0
        //遍历分支节点，包含并行及条件节点
        let branchItems = node.branchs.map((branchNode) => {
          //处理每个分支内子节点
          toMapping(branchNode)
          let childDoms = getDomTree(h, branchNode.children)
          decodeAppendDom(h, branchNode, childDoms, {
            level: index + 1,
            size: node.branchs.length,
          })
          //插入4条横线，遮挡掉条件节点左右半边线条
          insertCoverLine(h, index, childDoms, node.branchs)
          //遍历子分支尾部分支
          index++
          return h('div', { class: { 'branch-node-item': true } }, childDoms)
        })
        //插入添加分支/条件的按钮
        branchItems.unshift(
          h('div', { class: { 'add-branch-btn': true } }, [
            h(
              BranchButton,
              {
                class: { 'add-branch-btn-el': true },
                size: 'small',
                round: true,
                text: isConditionNode(node) ? '条件分支' : '并行分支',
                isConditionNode: isConditionNode(node),
                onAddBranchNode: (type) => addBranchNode(node, type),
                onOpenConfig: () => openConfig(node),
              },
              [],
            ),
          ]),
        )
        let bchDom = [h('div', { class: { 'branch-node': true } }, branchItems)]
        //继续遍历分支后的节点
        let afterChildDoms = getDomTree(h, node.children)
        return [h('div', {}, [bchDom, afterChildDoms])]
      } else if (isEmptyNode(node)) {
        //空节点，存在于分支尾部
        let childDoms = getDomTree(h, node.children)
        decodeAppendDom(h, node, childDoms)
        return [h('div', { class: { 'empty-node': true } }, childDoms)]
      } else {
        //遍历到了末端，无子节点
        return []
      }
    }

    // 解码渲染的时候插入dom到同级
    const decodeAppendDom = (h, node, dom, props = {}) => {
      props['config'] = node

      dom.unshift(
        h(
          componentsMap[node.type.toUpperCase()],
          {
            ...props,
            ref: node.id,
            key: node.id,
            //定义事件，插入节点，删除节点，选中节点，复制/移动
            onInsertNode: (type) => insertNode(type, node),
            onDelNode: () => delNode(node),
            onSelected: () => selectNode(node),
            onLeftMove: () => branchMove(node, -1),
            onRightMove: () => branchMove(node, 1),
          },
          [],
        ),
      )
    }

    //id映射到map，用来向上遍历
    const toMapping = (node) => {
      if (node && node.id) {
        //console.log("node=> " + node.id + " name:" + node.name + " type:" + node.type)
        nodeMap.value.set(node.id, node)
      }
    }

    const insertCoverLine = (h, index, doms, branchs) => {
      if (index === 0) {
        //最左侧分支
        doms.unshift(h('div', { class: { 'line-top-left': true } }, []))
        doms.unshift(h('div', { class: { 'line-bot-left': true } }, []))
      } else if (index === branchs.length - 1) {
        //最右侧分支
        doms.unshift(h('div', { class: { 'line-top-right': true } }, []))
        doms.unshift(h('div', { class: { 'line-bot-right': true } }, []))
      }
    }

    const branchMove = (node, offset) => {
      let parentNode = nodeMap.value.get(node.parentId)
      let index = parentNode.branchs.indexOf(node)
      let branch = parentNode.branchs[index + offset]
      parentNode.branchs[index + offset] = parentNode.branchs[index]
      parentNode.branchs[index] = branch
      proxy?.$forceUpdate()
    }

    // 判断是否为主要业务节点
    const isPrimaryNode = (node) => {
      return (
        node &&
        (node.type === 'ROOT' ||
          node.type === 'APPROVAL' ||
          node.type === 'DEAL' ||
          node.type === 'DELAY' ||
          node.type === 'TRIGGER')
      )
    }

    const isBranchNode = (node) => {
      return node && (node.type === 'CONDITIONS' || node.type === 'CONCURRENTS')
    }

    const isEmptyNode = (node) => {
      return node && node.type === 'EMPTY'
    }
    //是分支节点
    const isConditionNode = (node) => {
      return node.type === 'CONDITIONS'
    }
    //是分支节点
    const isBranchSubNode = (node) => {
      return node && (node.type === 'CONDITION' || node.type === 'CONCURRENT')
    }
    const getRandomId = () => {
      return `node_${new Date().getTime().toString().substring(5)}${Math.round(
        Math.random() * 9000 + 1000,
      )}`
    }
    //选中一个节点
    const selectNode = (node) => {
      flowStore.setSelectedNode(node)
      emit('selectedNode', node)
    }

    //处理节点插入逻辑
    const insertNode = (type, parentNode) => {
      proxy?.$refs['_root'].click()
      //缓存一下后面的节点
      let afterNode = parentNode.children
      //插入新节点
      parentNode.children = {
        id: getRandomId(),
        parentId: parentNode.id,
        props: {},
        type: type.toUpperCase(),
      }
      switch (type) {
        case 'APPROVAL':
          insertApprovalNode(parentNode)
          break
        case 'DEAL':
          insertDealNode(parentNode)
          break
        case 'CONDITIONS':
          insertConditionsNode(parentNode)
          break
        case 'CONCURRENTS':
          insertConcurrentsNode(parentNode)
          break
        default:
          break
      }
      //拼接后续节点
      if (isBranchNode({ type: type })) {
        if (afterNode && afterNode.id) {
          afterNode.parentId = parentNode.children.children.id
        }
        parentNode.children.children.children = afterNode
      } else {
        if (afterNode && afterNode.id) {
          afterNode.parentId = parentNode.children.id
        }
        parentNode.children.children = afterNode
      }
      proxy?.$forceUpdate()
    }

    const insertApprovalNode = (parentNode) => {
      parentNode.children.name = '审批人'
      parentNode.children.props = cloneDeep(DefaultProps.APPROVAL_PROPS)
    }
    const insertDealNode = (parentNode) => {
      parentNode.children.name = '办理人'
      parentNode.children.props = cloneDeep(DefaultProps.DEAL_PROPS)
    }
    const insertConditionsNode = (parentNode) => {
      parentNode.children.name = '条件分支'
      parentNode.children.children = {
        id: getRandomId(),
        parentId: parentNode.children.id,
        type: 'EMPTY',
      }
      parentNode.children.branchs = [
        {
          id: getRandomId(),
          parentId: parentNode.children.id,
          type: 'CONDITION',
          props: cloneDeep(DefaultProps.CONDITION_PROPS),
          name: '条件1',
          children: {},
        },
        {
          id: getRandomId(),
          parentId: parentNode.children.id,
          type: 'CONDITION',
          props: cloneDeep(DefaultProps.CONDITION_PROPS),
          name: '条件2',
          children: {},
        },
      ]
    }
    const insertConcurrentsNode = (parentNode) => {
      parentNode.children.name = '并行分支'
      parentNode.children.children = {
        id: getRandomId(),
        parentId: parentNode.children.id,
        type: 'EMPTY',
      }

      parentNode.children.branchs = [
        {
          id: getRandomId(),
          name: '审批节点',
          parentId: parentNode.children.id,
          type: 'APPROVAL',
          props: {
            ...cloneDeep(DefaultProps.APPROVAL_PROPS),
            style: {
              margin: '30px',
            },
            isBranchNode: true,
          },
          children: {},
        },
        {
          id: getRandomId(),
          name: '办理节点',
          parentId: parentNode.children.id,
          type: 'DEAL',
          props: {
            ...cloneDeep(DefaultProps.DEAL_PROPS),
            style: {
              margin: '30px',
            },
            isBranchNode: true,
          },
          children: {},
        },
      ]
    }

    const getBranchEndNode = (conditionNode) => {
      if (!conditionNode.children || !conditionNode.children.id) {
        return conditionNode
      }
      return getBranchEndNode(conditionNode.children)
    }

    /**
     * 添加分支节点
     * @param node
     * @param type (CONDITIONS: 条件分支  APPROVAL:审批节点 DEAL:办理节点)
     */
    const addBranchNode = (node, type) => {
      if (node.branchs.length < 8) {
        switch (type) {
          case 'CONDITIONS':
            node.branchs.push({
              id: getRandomId(),
              parentId: node.id,
              name: '条件' + (node.branchs.length + 1),
              props: cloneDeep(DefaultProps.CONDITION_PROPS),
              type: 'CONDITION',
              children: {},
            })
            break
          case 'APPROVAL':
            node.branchs.push({
              id: getRandomId(),
              parentId: node.id,
              name: '审批人' + (node.branchs.length + 1),
              props: {
                ...cloneDeep(DefaultProps.APPROVAL_PROPS),
                style: {
                  margin: '30px',
                },
                isBranchNode: true,
              },
              type: 'APPROVAL',
              children: {},
            })
            break
          case 'DEAL':
            node.branchs.push({
              id: getRandomId(),
              parentId: node.id,
              name: '办理人' + (node.branchs.length + 1),
              props: {
                ...cloneDeep(DefaultProps.DEAL_PROPS),
                style: {
                  margin: '30px',
                },
                isBranchNode: true,
              },
              type: 'DEAL',
              children: {},
            })
            break
          default:
            break
        }
      } else {
        onlyMessage('最多只能添加 8 项😥', 'warning')
      }
    }

    // 打开配置抽屉
    const openConfig = (node) => {
      console.log('打开配置抽屉', node)
    }

    //删除当前节点
    const delNode = (node) => {
      console.log('删除节点', node)
      //获取该节点的父节点
      let parentNode = nodeMap.value.get(node.parentId)
      if (parentNode) {
        //判断该节点的父节点是不是分支节点
        if (isBranchNode(parentNode)) {
          //移除该分支
          parentNode.branchs.splice(parentNode.branchs.indexOf(node), 1)
          //处理只剩1个分支的情况
          if (parentNode.branchs.length < 2) {
            //获取条件组的父节点
            let ppNode = nodeMap.value.get(parentNode.parentId)
            //判断唯一分支是否存在业务节点
            if (
              parentNode.branchs[0].children &&
              parentNode.branchs[0].children.id
            ) {
              //将剩下的唯一分支头部合并到主干
              ppNode.children = parentNode.branchs[0].children
              ppNode.children.parentId = ppNode.id
              //搜索唯一分支末端最后一个节点
              let endNode = getBranchEndNode(parentNode.branchs[0])
              //后续节点进行拼接, 这里要取EMPTY后的节点
              endNode.children = parentNode.children.children
              if (endNode.children && endNode.children.id) {
                endNode.children.parentId = endNode.id
              }
            } else {
              //直接合并分支后面的节点，这里要取EMPTY后的节点
              ppNode.children = parentNode.children.children
              if (ppNode.children && ppNode.children.id) {
                ppNode.children.parentId = ppNode.id
              }
            }
          }
        } else {
          //不是的话就直接删除
          if (node.children && node.children.id) {
            node.children.parentId = parentNode.id
          }
          parentNode.children = node.children
        }
        proxy?.$forceUpdate()
      } else {
        onlyMessage('出现错误，找不到上级节点😥', 'warning')
      }
    }

    const validateProcess = () => {
      valid.value = true
      let err = []
      validate(err, dom.value)
      return err
    }
    const validateNode = (err, node) => {
      if (proxy?.$refs[node.id].validate) {
        valid.value = proxy?.$refs[node.id].validate(err)
      }
    }
    //更新指定节点的dom
    const nodeDomUpdate = (node) => {
      proxy?.$refs[node.id].$forceUpdate()
    }

    //给定一个起始节点，遍历内部所有节点
    const forEachNode = (parent, node, callback) => {
      if (isBranchNode(node)) {
        callback(parent, node)
        forEachNode(node, node.children, callback)
        node.branchs.map((branchNode) => {
          callback(node, branchNode)
          forEachNode(branchNode, branchNode.children, callback)
        })
      } else if (
        isPrimaryNode(node) ||
        isEmptyNode(node) ||
        isBranchSubNode(node)
      ) {
        callback(parent, node)
        forEachNode(node, node.children, callback)
      }
    }

    //校验所有节点设置
    const validate = (err, node) => {
      if (isPrimaryNode(node)) {
        validateNode(err, node)
        validate(err, node.children)
      } else if (isBranchNode(node)) {
        //校验每个分支
        node.branchs.map((branchNode) => {
          //校验条件节点
          validateNode(err, branchNode)
          //校验条件节点后面的节点
          validate(err, branchNode.children)
        })
        validate(err, node.children)
      } else if (isEmptyNode(node)) {
        validate(err, node.children)
      }
    }

    // 鼠标滚动事件
    const _scale = ref(1)
    const onMousewheel = ({ deltaY }) => {
      if (deltaY < 0) {
        _scale.value = parseFloat(
          (_scale.value >= 1 ? 1 : _scale.value + 0.1).toFixed(1),
        )
      } else {
        _scale.value = parseFloat(
          (_scale.value <= 0.5 ? 0.5 : _scale.value - 0.1).toFixed(1),
        )
      }
    }

    // 鼠标拖动事件

    // 渲染组件
    return () => {
      console.log('渲染流程树')
      nodeMap.value.clear()
      let processTrees = getDomTree(h, dom.value)

      //插入末端节点
      processTrees.push(
        h('div', { style: { 'text-align': 'center' } }, [
          h('div', {
            class: { 'process-end': true },
            innerHTML: '流程结束',
          }),
        ]),
      )

      //   console.log('processTrees: ', processTrees)
      return h(
        'div',
        {
          ref: '_root',
          class: { _root: true },
          style: {
            transform: `scale(${_scale.value})`,
          },
          //   onMousewheel: (e) => onMousewheel(e),
        },
        processTrees,
      )
    }
  },
})

export default FlowDesigner
