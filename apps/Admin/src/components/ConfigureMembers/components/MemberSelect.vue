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
            <div class="center-tree" v-if="active !== 'relation'">
              <div v-if="active === 'relation'">主体</div>
              <!-- 搜索 -->
              <j-input
                v-model:value="searchText"
                placeholder="请输入"
                v-show="showSearch && active === type"
              />
              <j-tree
                multiple
                block-node
                :tree-data="treeDataCom"
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
            <Relational
              v-else
              :dataSource="dataSource"
              :treeData="treeDataCom"
              @relSubmit="relSubmit"
            />
          </div>
        </j-col>
        <j-col span="10">
          <div class="content-right">
            <div class="right-top">
              <div class="selected">已选择：{{ dataSource.length }}</div>
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
                <template v-if="column.key === 'weight'">
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
                      onConfirm: () => handleDel(record.id),
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
import Relational from './Relational.vue'
import { treeFilter } from 'jetlinks-ui-components/es/Tree'
import { defaultColumns, flattenTree } from './const'
import { DataSourceProps } from '../types'
import {
  getDepartmentList_api,
  getUserList_api,
  getRoleList_api,
} from '@/api/user'

const props = defineProps<{
  //组织/用户/角色
  type: string
  showSearch: boolean
  isNode: boolean
  hasWeight: boolean
}>()
const emits = defineEmits<{
  (e: 'back'): void
}>()
// 已选择的成员
const members: any = inject('members')

const columns = computed(() => {
  if (props.hasWeight) {
    return defaultColumns(props.type)
  } else {
    return defaultColumns(props.type).filter((item) => item.key !== 'weight')
  }
})

// 筛选关键字
const searchText = ref('')
const treeDataCom = computed(() => {
  return searchText.value
    ? treeFilter(treeData.value, searchText.value, 'name')
    : treeData.value
})

const active = ref()
const itemClick = (key) => {
  // 树形数据
  // treeData.value = leftList[key].treeData
  active.value = key
}

// 树数据
const treeData = ref<any[]>([])

// 选中的树节点
const selectedKeys = ref<string[]>([])
const onSelect = (keys: string[], { selected, node }) => {
  // 按关系
  if (active.value === 'relation') {
    return
  }
  const index = dataSource.value
    .map((i) => i.id)
    .findIndex((i) => i === node.id)
  if (index === -1) {
    dataSource.value.push({
      id: node.id,
      name: node.name,
      weight: props.hasWeight ? 1 : undefined,
      type: props.type,
      other: active.value,
    })
  } else {
    dataSource.value.splice(index, 1)
  }
}

// 判断key是否已添加到dataSource中
// const isExist = (key: string) => {
//   return dataSource.value.some((i) => i.id === key)
// }

// 确定
const relSubmit = (data: any[]) => {
  data.forEach((i) => {
    dataSource.value.push({
      id: i.id,
      name: i.name,
      weight: props.hasWeight ? 1 : undefined,
      type: props.type,
      other: active.value,
    })
  })
}

/**
 * 清空选择的数据
 */
const clear = () => {
  selectedKeys.value = []
  dataSource.value = []
}

const leftList = computed(() => {
  active.value = props.type
  return [
    {
      key: props.type,
      title: '固定组织',
      description: '固定组织下的所有成员均可以作为候选人',
    },
    {
      key: 'var',
      title: '按变量',
      description:
        '指定流程表单中的组织选择组件作为组织变量来源，其下方的所有成员均可作为候选人',
    },
    {
      key: 'relation',
      title: '按关系',
      description:
        '指定流程表单或流程节点中的变量，其所属组织下的所有成员均可作为候选人',
    },
  ]
})
const dataSource = ref<DataSourceProps[]>([])

/**
 * 删除已选择
 * @param id 删除的数据id
 */
const handleDel = (id: string) => {
  selectedKeys.value = selectedKeys.value.filter((item) => item !== id)
  dataSource.value = dataSource.value.filter((item) => item.id !== id)
}

// itemClick('0')

const getTreeData = () => {
  if (props.type === 'org') {
    getDepartmentList_api().then((res) => {
      treeData.value = res.result
    })
  } else if (props.type === 'user') {
    getUserList_api({ paging: false }).then((res) => {
      treeData.value = res.result.data
    })
  } else if (props.type === 'role') {
    getRoleList_api().then((res) => {
      treeData.value = res.result
    })
  }
}

watch(
  () => [props.type, props.isNode],
  () => {
    if (!props.isNode) {
      // 基础信息
      getTreeData()
    } else {
      // 设计流程
      getTreeData()
    }
  },
  { immediate: true },
)

watch(
  () => [props.type, members],
  () => {
    dataSource.value = members.value.filter((i) => i.type === props.type)
    selectedKeys.value = dataSource.value.map((item) => item.id)
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
    // display: flex;
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
