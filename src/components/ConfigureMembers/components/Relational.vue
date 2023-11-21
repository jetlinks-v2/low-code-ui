<template>
  <div class="relational">
    <div class="subject">
      <div class="title">主体</div>
      <j-tree
        :multiple="multiple"
        block-node
        :tree-data="relationTreeData"
        :selectedKeys="selectedKeys"
        :fieldNames="{
          children: 'children',
          title: 'name',
          key: 'fullId',
        }"
        :height="300"
        @select="onSelect"
      >
        <template #title="data">
          <j-ellipsis>
            {{ data.name }}
          </j-ellipsis>
        </template>
      </j-tree>
      <j-empty v-if="relationTreeData && relationTreeData.length < 1" />
    </div>
    <div class="subject-rel">
      <div class="title">
        主体的关系
        <j-button
          v-show="selectedKeys.length"
          :disabled="!Object.keys(intermediateData).length"
          size="small"
          type="primary"
          @click="relSubmit"
          >确定</j-button
        >
      </div>
      <span v-show="selectedKeys.length">
        <j-tree
          block-node
          :tree-data="relData"
          :selectedKeys="relSelectedKeys"
          :fieldNames="{
            children: 'children',
            title: 'name',
            key: 'relation',
          }"
          :height="300"
          @select="onRelSelect"
        >
          <template #title="data">
            <j-ellipsis>
              {{ data.name }}
            </j-ellipsis>
          </template>
        </j-tree>
        <j-empty v-if="relData.length < 1" />
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onlyMessage } from '@jetlinks-web/utils'
import { DataSourceProps } from '../types'
import { getRelation_api } from '@LowCode/api/member'
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  type: {
    type: String,
    default: '',
  },
  treeData: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  dataSource: {
    type: Array as PropType<DataSourceProps[]>,
    default: () => [],
  },
})

const emits = defineEmits<{
  (e: 'rel-submit', subject: any, data: any): void
}>()

// 流程表单项
const hasFrom = {
  org: ['product', 'device', 'user'],
  user: ['product', 'device', 'org', 'user', 'role'],
  role: ['user'],
}

const multiple = ref<boolean>(false)
const selectedKeys = ref<string[]>([])
// 关系数据
const relData = ref<any[]>([])
const relSelectedKeys = ref<string[]>([])
// 暂存需要添加到表格的数据
const intermediateData = ref<any>({})
const currentSub = ref<any>({})

const relationTreeData = computed(() => {
  return filterAndDeleteEmptyParents(cloneDeep(props.treeData), (item) => {
    if (item.others && item.others.relation) {
      return (
        hasFrom[props.type].includes(item.others.type) ||
        !item.fullId.includes('form')
      )
    } else {
      return false
    }
  })?.filter((i) => i.id !== 'task')
})

/**
 * 根据维度过滤关系数据
 * @param data 初始数据
 * @param fun 条件函数
 */
function filterAndDeleteEmptyParents(data: any, fun: (item: any) => boolean) {
  // 递归过滤掉最后一个层级中others没有relation的数据
  function filterNodes(nodes) {
    return nodes.filter((node) => {
      if (node.children) {
        node.children = filterNodes(node.children)
        return node.children.length > 0
      } else {
        return fun(node)
      }
    })
  }
  // 递归删除父节点的children为空的节点
  function deleteEmptyParents(nodes) {
    nodes.forEach((node) => {
      if (node.children) {
        node.disabled = true
        deleteEmptyParents(node.children)
        if (node.children.length === 0) {
          delete node.children
        }
      }
    })
  }
  const filteredData = filterNodes(data)
  deleteEmptyParents(filteredData)
  return filteredData
}

const onSelect = (keys: string[], { node }: { node: any }) => {
  currentSub.value = node
  intermediateData.value = {}
  // 删除选择未确定的数据
  relSelectedKeys.value = []
  selectedKeys.value = [...keys]

  getRelationalData(node.others?.relation)
}

// 获取主体的关系数据
const getRelationalData = (type: string) => {
  const param = {
    objectType: type,
    targetType: props.type,
  }
  getRelation_api(param).then((res) => {
    if (res.success) {
      relData.value = res.result
    }
  })
}
const onRelSelect = (
  keys: string[],
  { selected, node }: { selected: boolean; node: any },
) => {
  if (!selected) return
  relSelectedKeys.value = [...keys]
  intermediateData.value = node
}

/**
 * 确认按钮
 */
const relSubmit = () => {
  const flag = props.dataSource.some(
    (i) =>
      i.id === `${currentSub.value.fullId}-${intermediateData.value.relation}`,
  )
  if (flag) {
    onlyMessage('当前数据已添加', 'warning')
    return
  }
  emits('rel-submit', currentSub.value, intermediateData.value)
  intermediateData.value = {}
  relSelectedKeys.value = []
}
</script>
<style scoped lang="less">
.relational {
  display: flex;
  height: 100%;

  :deep(.ant-tree) {
    .ant-tree-treenode-disabled {
      .ant-tree-node-content-wrapper {
        &:hover {
          color: rgba(0, 0, 0, 0.25) !important;
        }
      }
    }
    .ant-tree-treenode {
      .ant-tree-node-content-wrapper {
        &:hover {
          color: #315efb;
        }
      }
    }
    .ant-tree-switcher {
      height: 32px;
      line-height: 32px;
    }
    .ant-tree-title {
      height: 32px;
      line-height: 32px;
    }
  }
  .subject {
    flex: 1;
    border: 1px solid #e0e0e0;
    .title {
      padding: 0 12px;
      height: 32px;
      line-height: 32px;
      background: #f2f2f2;
    }
  }
  .subject-rel {
    flex: 1;
    border: 1px solid #e0e0e0;
    border-left: none;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      height: 32px;
      line-height: 32px;
      background: #f2f2f2;
    }
  }
}
</style>
