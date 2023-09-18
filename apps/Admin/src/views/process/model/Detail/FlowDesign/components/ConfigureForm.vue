<template>
  <j-button type="primary" block size="small" ghost @click="visible = true">
    配置表单内容
  </j-button>
  <div v-for="(item, index) in forms" :key="index"></div>
  <j-modal
    v-model:visible="visible"
    width="900px"
    @ok="handleOk"
    @cancel="visible = false"
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
      <j-col :span="8">
        <j-input>
          <template #suffix>
            <AIcon type="SearchOutlined" />
          </template>
        </j-input>
        <j-tree
          checkable
          :tree-data="treeData"
          v-model:expandedKeys="expandedKeys"
        >
          <template #title="node">
            <div>
              <span style="margin-right: 20px">{{ node.title }}</span>
              <j-checkbox-group
                v-model:value="node.permission"
                :options="permissions"
              />
            </div>
          </template>
        </j-tree>
      </j-col>
      <j-col :span="16"> 表单名称 </j-col>
    </j-row>
  </j-modal>
</template>

<script setup lang="ts">
import type { TreeProps } from 'ant-design-vue'

type Emits = {
  (e: 'update:value', data: any[]): void
}

const emits = defineEmits<Emits>()
const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
})

const visible = ref(false)
const forms = computed({
  get: () => props.value,
  set: (val) => emits('update:value', val),
})

const treeData = ref([
  {
    title: '请假申请',
    key: '0-0',
    permission: ['read'],
    read: false,
    write: false,
    children: [
      {
        title: '标识',
        key: '0-0-0',
        permission: [],
        read: false,
        write: false,
      },
      {
        title: '名称',
        key: '0-0-1',
        permission: [],
        read: false,
        write: false,
      },
      {
        title: '请假类型',
        key: '0-0-2',
        permission: [],
        read: false,
        write: false,
      },
    ],
  },
  {
    title: '报销申请',
    key: '0-1',
    permission: [],
    read: false,
    write: false,
    children: [
      {
        title: '标识',
        key: '0-1-0',
        permission: [],
        read: false,
        write: false,
      },
      {
        title: '名称',
        key: '0-1-1',
        permission: [],
        read: false,
        write: false,
      },
    ],
  },
])
const expandedKeys = ref(['0-0', '0-1'])
const permissions = ref([
  { label: '读', value: 'read' },
  { label: '写', value: 'write' },
])
const test = ref([])

const handleOk = () => {}
</script>

<style lang="less" scoped></style>
