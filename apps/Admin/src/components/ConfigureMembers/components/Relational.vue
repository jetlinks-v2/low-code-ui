<template>
  <j-row>
    <j-col :span="12">
      <div>主体</div>
      <j-tree
        :multiple="multiple"
        block-node
        :tree-data="treeData"
        :selectedKeys="selectedKeys"
        :fieldNames="{ children: 'children', title: 'name', key: 'id' }"
        :height="400"
        @select="onSelect"
      >
        <template #title="data">
          <j-ellipsis>
            {{ data.name }}
          </j-ellipsis>
        </template>
      </j-tree>
    </j-col>
    <j-col :span="12">
      <div>
        主体的关系
        <j-button
          v-show="selectedKeys.length"
          :disabled="!intermediateData.length"
          size="small"
          type="primary"
          @click="relSubmit"
          >确定</j-button
        >
      </div>
      <j-tree
        multiple
        block-node
        :tree-data="relData"
        :selectedKeys="relSelectedKeys"
        :fieldNames="{
          children: 'children',
          title: 'name',
          key: 'id',
        }"
        :height="400"
        @select="onRelSelect"
      >
        <template #title="data">
          <j-ellipsis>
            {{ data.name }}
          </j-ellipsis>
        </template>
      </j-tree>
    </j-col>
  </j-row>
</template>
<script setup lang="ts">
const props = defineProps<{
  treeData: any[]
  dataSource: any[]
}>()

const emits = defineEmits<{
  (e: 'rel-submit', data: any[]): void
}>()

const multiple = ref<boolean>(false)
const selectedKeys = ref<string[]>([])

const onSelect = (keys: string[], { selected, node }) => {
  intermediateData.value = []
  // 删除选择未确定的数据
  // console.log(`output->`, props.dataSource)
  relSelectedKeys.value = props.dataSource.map((i) => i.id)
  selectedKeys.value = [...keys]
  getRelationalData(node.id)
}

// 关系数据
const relData = ref<any>([])
const relSelectedKeys = ref<string[]>([])

// 获取主体的关系数据
const getRelationalData = (key: string) => {
  if (key === 'fbff52da7270b6ac9687ef601f621b6b') {
    relData.value = [
      { name: '所属组织1', id: 'org1', children: [] },
      { name: '所属组织2', id: 'org2', children: [] },
    ]
  } else {
    relData.value = [{ name: '所属组织2222', id: 'org2222', children: [] }]
  }
  // relData.value = [{name: '所属组织', id: 'org', children:[] }]
}

// 暂存需要添加到表格的数据
const intermediateData = ref<any[]>([])

const onRelSelect = (keys: string[], { selected, node }) => {
  if (!selected) return
  relSelectedKeys.value = [...keys]
  intermediateData.value.push(node.dataRef)
}

// 确定
const relSubmit = () => {
  emits('rel-submit', intermediateData.value)
  intermediateData.value = []
}
watch(
  () => props.dataSource,
  (val) => {
    relSelectedKeys.value = val.map((i) => i.id)
  },
)
</script>
<style scoped lang="less"></style>
