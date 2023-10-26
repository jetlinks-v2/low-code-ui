<!-- 表单变量 -->
<template>
  <j-modal
    v-model:visible="_visible"
    width="1000px"
    @ok="handleOk"
    @cancel="_visible = false"
  >
    <template #title>
      <j-space>
        <span>请确认当前节点需要候选人办理的表单内容</span>
        <j-tooltip placement="right">
          <template #title>
            未提供“读”权限的表单子字段对当前节点的办理人加密展示
          </template>
          <AIcon type="QuestionCircleOutlined" />
        </j-tooltip>
      </j-space>
    </template>
    <j-row :gutter="20">
      <j-col :span="10">
        <j-input v-model:value="searchValue">
          <template #suffix>
            <AIcon type="SearchOutlined" />
          </template>
        </j-input>
        <j-tree
          checkable
          blockNode
          defaultExpandAll
          :tree-data="treeDataFilter"
          :field-names="{ key: 'fullId', title: 'name' }"
          v-model:checkedKeys="checkedKeys"
          v-if="treeDataFilter.length"
          @check="handleCheck"
        >
          <template #title="node">
            <div style="display: flex; justify-content: space-between">
              <span style="margin-right: 20px">{{ node.name }}</span>
              <!-- <j-checkbox-group
                v-model:value="node.permission"
                :options="permissions"
              /> -->
            </div>
          </template>
        </j-tree>
      </j-col>
      <j-col :span="14"> 表单名称 </j-col>
    </j-row>
  </j-modal>
</template>

<script setup lang="ts">
import {
  PropType,
  computed,
  ref,
  getCurrentInstance,
  ComponentInternalInstance,
} from 'vue'
import { queryVariables_api } from '@/api/process/model'
import { useFlowStore } from '@/store/flow'
import { treeFilter } from 'jetlinks-ui-components/es/Tree'

type Emits = {
  (e: 'update:visible', data: boolean): void
  (e: 'update:variables', data: any[]): void
}

const emits = defineEmits<Emits>()
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  variables: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
})

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const flowStore = useFlowStore()

const _visible = computed({
  get: () => props.visible,
  set: (val) => {
    emits('update:visible', val)
  },
})

// 选中的节点id, 仅用于回显
const checkedKeys = ref<any[]>([])
// 选中的叶子节点
const checkedLeafNode = ref<any[]>([])

// 搜索字段
const searchValue = ref('')
// 接口返回的原始数据
const treeData = ref([])
// 页面渲染的数据(可能是筛选过后的)
const treeDataFilter = computed(() => {
  return searchValue.value
    ? treeFilter(treeData.value, searchValue.value, 'name')
    : treeData.value
})

const permissions = ref([
  { label: '读', value: 'read' },
  { label: '写', value: 'write' },
])

/**
 * 获取表单字段
 */
const getFormFields = async () => {
  const { id, name, key, model, provider } = flowStore.modelBaseInfo
  const params = {
    definition: {
      id,
      name,
      key,
      model: JSON.stringify(flowStore.model), // model不能取modelBaseInfo(接口保存才会有值), 直接取动态值flowStore.model
      provider,
    },
    nodeId: flowStore.model.nodes.id, // 展示及抄送直接传根节点id
  }
  const { result } = await queryVariables_api(params)
  treeData.value = result
}

/**
 * 选择变量
 * @param _
 * @param param1
 */
const handleCheck = (_, { checkedNodes }) => {
  checkedLeafNode.value = checkedNodes
    ?.filter((f) => !f.children?.length)
    ?.map((m) => ({
      label: m.name,
      value: m.fullId,
      color: randomColor(),
    }))
}

// 生成随机背景色，并且保证黑色文字可读性
const randomColor = () => {
  // const color = '#' + Math.floor(Math.random() * 0xffffff).toString(16)
  // return color
  const letters = '0123456789ABCDEF'
  let color = '#'
  do {
    color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
  } while (isDarkColor(color))

  return color
}
// 判断是否是深色
const isDarkColor = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness < 128
}

/**
 * 确认
 */
const handleOk = () => {
  emits('update:variables', checkedLeafNode.value)
  _visible.value = false
}

watch(
  () => _visible.value,
  (val) => {
    if (val) getFormFields()
  },
)
watch(
  () => props.variables,
  (val) => {
    checkedKeys.value = val.map((m) => m.value)
  },
  { immediate: true, deep: true },
)
</script>

<style lang="less" scoped></style>
