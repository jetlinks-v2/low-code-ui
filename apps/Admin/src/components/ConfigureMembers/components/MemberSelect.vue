<template>
  <div>
    <div>
      <PermissionButton type="link" @click="emits('back')">
        <AIcon type="LeftOutlined" /> 返回
      </PermissionButton>
    </div>
    <div class="content">
      <j-row>
        <j-col span="4" v-if="infoState.isNode">
          <div class="content-left">
            <!-- <j-space direction="vertical"> -->
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
            <!-- </j-space> -->
          </div>
        </j-col>
        <j-col span="10">
          <div class="content-center">
            <div class="center-tree" v-if="active !== 'relation'">
              <!-- <div v-if="active === 'relation'">主体</div> -->
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
                :height="368"
                @select="onSelect"
              >
                <template #title="data">
                  <j-ellipsis>
                    <span>
                      {{ data.name }}
                    </span>
                  </j-ellipsis>
                </template>
              </j-tree>
              <j-empty v-if="treeDataCom.length < 1" />
            </div>
            <!-- 主体的关系 -->
            <Relational
              v-else
              :type="type"
              :dataSource="dataSource"
              :treeData="relData"
              @rel-submit="relSubmit"
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
import { defaultColumns, leftData } from './const'
import { DataSourceProps } from '../types'
import {
  getDepartmentList_api,
  getUserList_api,
  getRoleList_api,
} from '@/api/user'
import { getVar_api } from '@/api/member'
import { detail_api } from '@/api/process/model'
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  type: {
    type: String,
    default: '',
  },
  showSearch: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits<{
  (e: 'back'): void
}>()

const route = useRoute()
const infoState: any = inject('infoState')
// 筛选关键字
const searchText = ref<string>('')
const active = ref<string>()
// 树数据
const treeData = ref<any[]>([])
// 选中的树节点
const selectedKeys = ref<string[]>([])
// 表格数据
const dataSource = ref<DataSourceProps[]>([])
// 固定数据/变量/关系
const fixedData = ref<any[]>([])
const varData = ref<any[]>([])
const relData = ref<any[]>([])

const columns = computed(() => {
  const _columns = defaultColumns(props.type)
  return infoState.hasWeight
    ? _columns
    : _columns.filter((item) => item.key !== 'weight')
})

const leftList = computed(() => {
  active.value = props.type
  return leftData[props.type]
})

const treeDataCom = computed(() => {
  return searchText.value
    ? treeFilter(treeData.value, searchText.value, 'name')
    : treeData.value
})

detail_api(route.query.id as string).then((res) => {
  if (res.success) {
    getTree(res.result)
  }
})

/**
 * 获取变量，关系的树
 */
const getTree = (data: any) => {
  const param = {
    definition: {
      ...data,
    },
    nodeId: infoState.nodeId,
    // nodeId: 'ROOT_1',
    containThisNode: true,
  }
  getVar_api(param).then((res) => {
    if (res.success) {
      varData.value = treeFilter(setLevel(res.result), props.type, 'type')
      relData.value = hasRelation(res.result)
    }
  })
}

/**
 * 遍历树，如果当前结点对象不包含relation属性，删除当前结点
 * @param data
 */
const hasRelation = (data: any) => {
  const cloneData = cloneDeep(data)
  function delTree(tree) {
    tree.forEach((item, index) => {
      if (item.children) {
        delTree(item.children)
      } else if (!item.others.relation) {
        tree.splice(index, 1)
      }
    })
  }
  delTree(cloneData)
  return cloneData
}

/**
 * 固定数据/变量/关系选择
 * @param key
 */
const itemClick = (key: string) => {
  active.value = key
  treeData.value =
    key === 'var'
      ? varData.value
      : key === 'relation'
      ? relData.value
      : fixedData.value
}

/**
 * 处理树结构
 * @param data
 * @param type 变量/关系
 */
const setLevel = (data: any[]) => {
  const cloneData = cloneDeep(data)
  function dealData(cloneData: any, level: number = 1) {
    cloneData.forEach((item) => {
      item.level = level
      item.id = item.fullId
      item.type = item.others?.type || ''
      if (level !== 3) {
        item.disabled = true
      }
      if (item.children && item.children.length > 0) {
        dealData(item.children, level + 1)
      }
    })
  }
  dealData(cloneData)
  return cloneData
}

const onSelect = (keys: string[], { node }) => {
  const index = dataSource.value.findIndex(
    (i) => i.id === (active.value === 'var' ? node.fullId : node.id),
  )
  if (index === -1) {
    dataSource.value.push({
      id: active.value === 'var' ? node.fullId : node.id,
      name: active.value === 'var' ? node.fullName : node.name,
      weight: infoState.hasWeight ? 1 : undefined,
      type: props.type,
      groupField: active.value,
      others:
        active.value === 'var'
          ? {
              source: 'upper',
              upperKey: node.fullId,
            }
          : undefined,
    })
  } else {
    dataSource.value.splice(index, 1)
  }
}

// 确定
const relSubmit = (subject: any, data: any) => {
  dataSource.value.push({
    id: `${subject.fullId}-${data.id}`,
    name: `${subject.fullName}-${data.name}`,
    weight: infoState.hasWeight ? 1 : undefined,
    type: props.type,
    groupField: active.value,

    others: {
      objectSource: {
        source: 'upper',
        upperKey: subject.fullId,
      },
      objectType: subject.others?.relation,
      related: {
        objectType: props.type,
        relation: data.relation,
        options: {
          reverse: data.reverse, //是否为反转关系
        },
      },
    },
  })
}

/**
 * 清空选择的数据
 */
const clear = () => {
  selectedKeys.value = []
  dataSource.value = []
}

/**
 * 删除已选择
 * @param id 删除的数据id
 */
const handleDel = (id: string) => {
  selectedKeys.value = selectedKeys.value.filter((item) => item !== id)
  dataSource.value = dataSource.value.filter((item) => item.id !== id)
}

const apiType = {
  org: getDepartmentList_api,
  user: getUserList_api,
  role: getRoleList_api,
}
const getTreeData = () => {
  apiType[props.type](props.type === 'user' ? { paging: false } : {}).then(
    (res) => {
      fixedData.value = props.type === 'user' ? res.result.data : res.result
      treeData.value = fixedData.value
    },
  )
}
getTreeData()

watch(
  () => [props.type, infoState.members],
  () => {
    dataSource.value = infoState.members.value.filter(
      (i) => i.type === props.type,
    )
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
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 400px;

    height: 100%;
    padding: 0 10px;
    border-right: 1px solid #7cb305;
    .left-item {
      height: 100%;
      padding: 10px;
      background-color: #f0f2f5;
    }

    .active {
      background-color: #e2c2ff;
    }
  }

  .content-center {
    height: 100%;

    .center-tree {
      padding: 0 10px;
      flex: 1;
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
