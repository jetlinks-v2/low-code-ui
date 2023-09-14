<template>
  <div>
    <div>
      <PermissionButton type="link" @click="emits('back')">
        <AIcon type="LeftOutlined" /> 返回
      </PermissionButton>
    </div>
    <div class="content">
      <j-row>
        <j-col span="4" v-if="isNode">
          <div class="content-left">
            <j-space direction="vertical">
              <div
                class="left-item"
                :class="{ active: active === item.key }"
                v-for="item of leftList"
                :key="item.key"
                @click="itemClick(item.key)"
              >
                <div class="left-item-title">
                  {{ item.title }}
                </div>
                <span>
                  {{ item.description }}
                </span>
              </div>
            </j-space>
          </div>
        </j-col>
        <j-col span="10">
          <div class="content-center">
            <div class="center-tree">
              <div v-if="active === '2'">主体</div>
              <!-- 搜索 -->
              <j-input
                v-model:value="searchText"
                placeholder="请输入"
                v-show="showSearch && active === '0'"
              />
              <j-tree
                multiple
                block-node
                :tree-data="treeData"
                v-model:selectedKeys="selectedKeys"
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
            </div>
            <!-- 主体的关系 -->
            <div class="center-relation" v-if="active === '2'">
              <div>主体的关系</div>
            </div>
          </div>
        </j-col>
        <j-col span="10">
          <div class="content-right">
            <div class="right-top">
              <div class="selected">已选择：{{ selectedKeys.length }}</div>
              <j-button type="primary" @click="clear">清空</j-button>
            </div>
            <j-table
              size="small"
              model="TABLE"
              :columns="columns"
              :dataSource="dataSource"
              :pagination="{
                defaultPageSize: 10,
              }"
              childrenColumnName="no_children"
            >
              <template #bodyCell="{ column, text, record }">
                <template v-if="column.key === 'weights'">
                  <j-input-number
                    :min="1"
                    :max="99"
                    :precision="0"
                    :controls="false"
                    v-model:value="record[column.dataIndex]"
                    style="margin: -5px 0"
                  />
                </template>
                <template v-if="column.key === 'action'">
                  <PermissionButton
                    size="small"
                    type="link"
                    :popConfirm="{
                      title: `确认删除？`,
                      onConfirm: () => handleDel(record.key),
                    }"
                  >
                    删除
                  </PermissionButton>
                </template>
              </template>
            </j-table>
          </div>
        </j-col>
      </j-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defaultColumns, flattenTree } from './const'
import { DataSourceProps } from '../types'
import {
  getDepartmentList_api,
  getUserList_api,
  getRoleList_api,
} from '@/api/user'

const props = defineProps<{
  //组织/用户/角色
  selectKey: string
  showSearch: boolean
  isNode: boolean
}>()
const emits = defineEmits<{
  (e: 'back'): void
}>()
// 已选择的成员
const members: any = inject('members')

const columns = computed(() => {
  if (props.isNode) {
    return defaultColumns
  } else {
    return defaultColumns.filter((item) => item.key !== 'weights')
  }
})

// 筛选关键字
const searchText = ref('')
const active = ref('0')
const itemClick = (key) => {
  // 树形数据
  // treeData.value = leftList[key].treeData
  active.value = key
}

// 树数据
const treeData = ref<any[]>([])

// 选中的树节点
const selectedKeys = ref<string[]>([])
const onSelect = (keys: string[], { node }) => {
  const index = dataSource.value
    .map((i) => i.key)
    .findIndex((i) => i === node.id)
  if (index === -1) {
    dataSource.value.push({
      key: node.id,
      title: node.name,
      weights: 1,
      selectKey: props.selectKey,
    })
  } else {
    dataSource.value.splice(index, 1)
  }
}

/**
 * 清空选择的数据
 */
const clear = () => {
  selectedKeys.value = []
  dataSource.value = []
}

const leftList = [
  {
    key: '0',
    title: '固定组织',
    description: '固定组织下的所有成员均可以作为候选人',
    // treeData: [
    //   {
    //     title: '组织名称1',
    //     key: '0-0-1701120627122417664',
    //     selectable: false,
    //     children: [
    //       {
    //         title: '组织名称',
    //         key: '0-0-1701120627122417665',
    //       },
    //       {
    //         title: '组织名称',
    //         key: '0-0-1701120627122417666',
    //       },
    //     ],
    //   },
    // ],
  },
  {
    key: '1',
    title: '按变量',
    description:
      '指定流程表单中的组织选择组件作为组织变量来源，其下方的所有成员均可作为候选人',
    // treeData: [
    //   {
    //     title: '字段变量',
    //     key: '0-0-1701120627',
    //     children: [
    //       {
    //         title: '流程表单名称',
    //         key: '0-0-17011206270',
    //       },
    //       {
    //         title: '组织选择',
    //         key: '0-0-17011206271',
    //       },
    //     ],
    //   },
    // ],
  },
  {
    key: '2',
    title: '按关系',
    description:
      '指定流程表单或流程节点中的变量，其所属组织下的所有成员均可作为候选人',
    // treeData: [
    //   {
    //     title: '流程模型',
    //     key: '0-0',
    //     children: [
    //       {
    //         title: '流程模型名称',
    //         key: '0-0-0',
    //         children: [
    //           {
    //             title: '结点名称',
    //             key: '0-0-0-0',
    //             children: [
    //               {
    //                 title: '办理人',
    //                 key: '0-0-0-0-0',
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //       {
    //         title: '流程表单',
    //         key: '0-0-1',
    //       },
    //     ],
    //   },
    // ],
  },
]

const dataSource = ref<DataSourceProps[]>([])

/**
 * 删除已选择
 * @param key 删除的数据key
 */
const handleDel = (key: string) => {
  selectedKeys.value = selectedKeys.value.filter((item) => item !== key)
  dataSource.value = dataSource.value.filter((item) => item.key !== key)
}

itemClick('0')

const getTreeData = () => {
  if (props.selectKey === 'organization') {
    getDepartmentList_api().then((res) => {
      treeData.value = res.result
    })
  } else if (props.selectKey === 'user') {
    getUserList_api({ paging: false }).then((res) => {
      treeData.value = res.result.data
    })
  } else if (props.selectKey === 'role') {
    getRoleList_api().then((res) => {
      treeData.value = res.result
    })
  }
}

watch(
  () => [props.selectKey, props.isNode],
  () => {
    if (!props.isNode) {
      // 基础信息
      // getTreeData
    } else {
      // 设计流程
      getTreeData()
    }
  },
  { immediate: true },
)

watch(
  () => [props.selectKey, members],
  () => {
    dataSource.value = members.value.filter(
      (i) => i.selectKey === props.selectKey,
    )
    selectedKeys.value = dataSource.value.map((item) => item.key)
  },
  { immediate: true },
)

defineExpose({
  dataSource,
})
</script>
<style scoped lang="less">
.content {
  min-height: 400px;
  .content-left {
    height: 400px;
    padding: 0 10px;
    border-right: 1px solid #7cb305;
    .left-item {
      width: 100%;
      // height: 100px;
      background-color: #f0f2f5;
    }

    .active {
      background-color: #e2c2ff;
    }
  }

  .content-center {
    display: flex;
    height: 100%;
    // padding: 0 2px;
    border-right: 1px solid #7cb305;

    .center-tree {
      padding: 0 10px;
      flex: 1;
    }
    .center-relation {
      flex: 1;
      height: 100%;
      padding: 0 10px;
      border-left: 1px solid #7cb305;
    }
  }

  .content-right {
    height: 100%;
    padding: 0 10px;

    .right-top {
      display: inline-flex;
      justify-content: space-between;
      gap: 8px;
      align-items: center;
      width: 100%;
      height: 32px;
      margin-bottom: 10px;

      .selected {
        // height: 100%;
        line-height: 32px;
        flex: 0.9;
        background-color: #f2f2f2;
      }
    }
  }
}
</style>
