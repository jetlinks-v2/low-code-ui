<!-- 表单变量 -->
<template>
  <j-modal
    v-model:visible="_visible"
    width="1000px"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
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
        <j-scrollbar max-height="600">
          <j-tree
            checkable
            blockNode
            defaultExpandAll
            :tree-data="treeDataFilter"
            :field-names="{ key: 'fullId', title: 'name' }"
            :checkedKeys="checkedKeys"
            v-if="treeDataFilter.length"
            @check="handleCheck"
          >
            <template #title="node">
              <div style="display: flex; justify-content: space-between">
                <span style="margin-right: 20px">{{ node.name }}</span>
              </div>
            </template>
          </j-tree>
          <j-empty v-else style="margin-top: 50px;" />
        </j-scrollbar>
      </j-col>
      <j-col :span="14">
        <j-scrollbar max-height="600">
          <template v-for="(item, index) in previewData" :key="index">
            <div>{{ item.name }}</div>
            <FormPreview :data="item.configuration" />
          </template>
        </j-scrollbar>
      </j-col>
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
import { queryFormNoPage_api } from '@/api/process/model'
import { useFlowStore } from '@/store/flow'
import { treeFilter } from 'jetlinks-ui-components/es/Tree'
import { generateRandomColor, rdmRgbColor } from '../utils'
import { cloneDeep } from 'lodash-es'

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
  // 左侧树形数据
  treeData: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  previewData: {
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
// 表单预览数据
// const previewData = ref<any[]>([])
// 页面渲染的数据(可能是筛选过后的)
const treeDataFilter = computed(() => {
  if(searchValue.value) {
    return treeFilter(props.treeData, searchValue.value, 'name').map(item => {
      return {
        ...item,
        disabled: !!item.children?.length
      }
    })
  } else {
    return props.treeData
  }
})

/**
 * 获取表单字段
 */
// const getFormFields = async () => {
//   if (!props.treeData?.length) return
//   const params = {
//     paging: false,
//     terms: [
//       {
//         column: 'key',
//         termType: 'in',
//         value: props.treeData?.map((m) => m.id),
//       },
//       {
//         value: true,
//         termType: 'eq',
//         type: 'and',
//         column: 'latest',
//       },
//     ],
//   }
//   const { result } = await queryFormNoPage_api(params)
//   previewData.value = result
// }

/**
 * 选择变量
 * @param _
 * @param param1
 */
const handleCheck = (_checkedKeys, { checkedNodes }) => {
  checkedKeys.value = _checkedKeys
  checkedLeafNode.value = checkedNodes
    ?.filter((f) => !f.children?.length)
    ?.map((m) => ({
      label: m.name,
      value: m.fullId,
      color: rdmRgbColor(),
    }))
}

/**
 * 确认
 */
const handleOk = () => {
  emits('update:variables', checkedLeafNode.value)
  _visible.value = false
}

const handleCancel = ()=>{
  // console.log('props.variables',props.variables)
  // emits('update:variables', props.variables.map((m) => m.value))
  // checkedKeys.value = []
  _visible.value = false
}

// watch(
//   () => _visible.value,
//   (val) => {
//     if (val) getFormFields()
//   },
// )
watch(
  () => props.variables,
  (val) => {
    checkedKeys.value = cloneDeep(val.map((m) => m.value))
  },
  { immediate: true, deep: true },
)
</script>

<style lang="less" scoped></style>
