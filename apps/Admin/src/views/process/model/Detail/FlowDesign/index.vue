<!-- 流程设计 -->
<template>
  <div style="height: 100%; width: 100%">
    <FlowDesigner
      ref="flowDesignerRef"
      @selectNode="nodeSelected"
      @delNode="nodeDel"
    />

    <j-drawer
      destroyOnClose
      placement="right"
      :width="600"
      :visible="showConfig"
      :closable="false"
      @close="handleClose"
    >
      <template v-if="isAdvanceConfig" #title> 高级配置 </template>
      <j-form v-show="!isAdvanceConfig" ref="nameRef" :model="formData">
        <j-form-item
          name="nodeName"
          :rules="[
            { required: true, trigger: 'blur', message: '请输入节点名称' },
            { max: 64, trigger: 'blur', message: '最多输入64个字符' },
          ]"
        >
          <j-input
            v-model:value="formData.nodeName"
            placeholder="请输入"
            style="margin-bottom: 10px"
          />
        </j-form-item>
      </j-form>

      <NodeConfig ref="nodeConfigRef" />
    </j-drawer>
  </div>
</template>

<script setup lang="ts">
import FlowDesigner from '@/components/FlowDesigner'
import NodeConfig from './components/NodeConfig.vue'
import { useFlowStore } from '@/store/flow'
import { findBranchLastNode, findNodeById } from './components/utils'
import { onlyMessage } from '@jetlinks/utils'

const flowStore = useFlowStore()
const selectedNode = computed(() => flowStore.selectedNode)

// 是否高级配置
const isAdvanceConfig = computed(() => {
  return ['CONDITIONS', 'CONCURRENTS'].includes(selectedNode.value?.type)
})

// 节点名称
const formData = reactive({
  nodeName: computed({
    get: () => selectedNode.value?.name,
    set: (val) => {
      flowStore.selectedNode.name = val
    },
  }),
})

const flowDesignerRef = ref()
const nameRef = ref()
const nodeConfigRef = ref()
const showConfig = ref(false)
const nodeSelected = (node) => {
  console.log('节点选中', node)
  showConfig.value = true
}

/**
 * 删除审批节点时, 判断上一个节点是否是办理节点,
 * 并且props.freeChoiceUser是否是当前删除节点的id
 * 如果是则设置props.freeChoiceUser = undefined
 */
const nodeDel = (node) => {
  //   console.log('节点删除', node)
  const parentNode = findNodeById(flowStore.model.nodes, node.parentId)
  if (
    parentNode.type === 'DEAL' &&
    parentNode.props.freeChoiceUser === node.id
  ) {
    // 如果父节点为办理节点, 并且"办理成员可以自由选择下一节点办理人"开关处于开启状态的值为当前删除节点的id
    parentNode.props.freeChoiceUser = undefined
  }
  // 如果父节点为空节点, 则上面一定为分支,
  // 关闭所有分支最后一个节点为办理节点的"办理成员可以自由选择下一节点办理人"开关
  if (parentNode.type === 'EMPTY') {
    const _branchNodes = findNodeById(
      flowStore.model.nodes,
      parentNode.parentId,
    )
    _branchNodes?.branches?.forEach((node) => {
      const _lastNode = findBranchLastNode(node)
      if (_lastNode.type === 'DEAL') {
        _lastNode.props.freeChoiceUser = undefined
      }
    })
  }
}

const handleClose = () => {
  // 关闭前校验节点名称
  nameRef.value.validate()
  // 校验配置内容
  nodeConfigRef.value.validateConfig()
  // 不论校验结果如何, 都关闭弹窗继续后续操作
  showConfig.value = false
}

/**
 * 保存节点数据至store
 */
const saveNodeConfig = () => {
  nodeConfigRef.value
    .saveConfigToStore()
    .then((valid) => {
      console.log('saveNodeConfig valid: ', valid)
      // 保存数据后校验一次流程图节点
      validateSteps()
      //   showConfig.value = false
    })
    .catch((err) => {
      console.log('saveNodeConfig err: ', err)
    })
}

/**
 * 校验节点数据是否合法
 */
const validateNodeConfig = () => {
  // 延时等待组件渲染后, 再出发校验方法
  setTimeout(() => {
    nodeConfigRef.value.validateConfig()
  }, 200)
}

watch(
  () => showConfig.value,
  (val) => {
    // 关闭抽屉, 保存数据 打开抽屉, 校验数据
    // !val ? saveNodeConfig() : validateNodeConfig()
    if (!val) {
      saveNodeConfig()
    } else {
      validateNodeConfig()
      nextTick(() => {
        nameRef.value.validate()
      })
    }
  },
)

/**
 * 当前步骤校验方法
 * @param type next: 点击下一步校验, deploy: 点击部署校验
 */
const validateSteps = (type?: string) => {
  return new Promise((resolve, reject) => {
    const err = flowDesignerRef.value.validateProcess()
    console.log('err: ', err)

    if (type && type === 'next' && err[0]?.name[0] === 'no-nodes') {
      // 下一步校验才有此提示, 部署不需要此提示
      onlyMessage('请先添加节点', 'warning')
    }
    // reject时 返回当前步骤序号
    !err.length ? resolve(1) : reject(1)
  })
}

defineExpose({ validateSteps })
</script>

<style lang="less" scoped></style>
