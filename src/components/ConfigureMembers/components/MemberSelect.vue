<template>
  <div>
    <div v-show="infoState.isNode">
      <PermissionButton type="text" @click="emits('back')">
        <AIcon type="LeftOutlined" /> 返回
      </PermissionButton>
    </div>
    <div class="content">
      <div class="content-left" v-if="infoState.isNode">
        <j-radio-group
          v-model:value="active"
          button-style="solid"
          class="radio"
          @change="searchText = ''"
        >
          <j-radio-button
            v-for="item in leftData[type]"
            :value="item.key"
            :key="item.key"
            :class="{ selected: active === item.key }"
          >
            <j-space>
              <div class="icon">
                <AIcon
                  v-if="item.key === 'var' || item.key === 'relation'"
                  :type="iconType[item.key]"
                />
                <AIcon v-else :type="iconType['fixed']" />
              </div>
              <div class="text">
                <div class="left-item-title">
                  {{ item.title }}
                </div>
                <span class="description">
                  <j-ellipsis line-clamp="4" style="line-height: 20px">{{
                    item.description
                  }}</j-ellipsis>
                </span>
              </div>
            </j-space>
          </j-radio-button>
        </j-radio-group>
      </div>
      <div class="content-center">
        <div class="center-tree" v-if="active !== 'relation'">
          <!-- 搜索 -->
          <j-input-search
            style="margin-bottom: 8px"
            v-model:value="searchText"
            placeholder="请输入"
            v-show="showSearch && active === type"
            @search="onSearch"
          />
          <j-tree
            multiple
            block-node
            :tree-data="treeDataCom"
            :selectedKeys="selectedKeys"
            :fieldNames="{
              children: 'children',
              title: 'name',
              key: ['org', 'user', 'role'].includes(active) ? 'id' : 'fullId',
            }"
            @select="onSelect"
          >
            <template #title="data">
              <j-ellipsis>
                <span style="margin-right: 80px">
                  {{ data.name }}
                </span>
              </j-ellipsis>
            </template>
          </j-tree>
          <j-empty v-if="treeDataCom && treeDataCom.length < 1" />
        </div>
        <!-- 主体的关系 -->
        <Relational
          v-else
          :type="type"
          :dataSource="dataSource"
          :treeData="treeData"
          @rel-submit="relSubmit"
        />
      </div>
      <div class="content-right">
        <div class="right-top">
          <div class="selected">
            已选择<span class="num">{{ dataSource.length }}</span
            >项
          </div>
          <PermissionButton
            type="primary"
            size="small"
            :popConfirm="{
              title: `确认清空？`,
              onConfirm: () => clear(),
            }"
          >
            清空
          </PermissionButton>
        </div>
        <j-table
          size="small"
          model="TABLE"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="{
            defaultPageSize: 10,
          }"
          :scroll="{ y: 230 }"
          class="table-row"
          :row-class-name="
            (_record, index) => (_record.isDel ? 'table-del' : null)
          "
        >
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.key === 'name'">
              <div class="name">
                <div
                  v-if="infoState.isNode"
                  class="type"
                  :style="{
                    background: record.isDel
                      ? '#e50012'
                      : dimensionsColor[record.groupField],
                  }"
                ></div>
                <j-tooltip :title="text">
                  <div class="name-text">
                    {{ text }}
                  </div>
                </j-tooltip>
              </div>
            </template>
            <template v-if="column.key === 'weight'">
              <div>
                <j-input-number
                  :min="1"
                  :max="99"
                  :precision="0"
                  v-model:value="record[column.dataIndex]"
                  style="margin: -5px 0; width: 70px"
                  :parser="(num) => (!num ? 1 : isNaN(Number(num)) ? 1 : num)"
                />
              </div>
              <!-- :bordered="bordered"
                @focus="bordered=true"
                @blur="bordered=false" -->
            </template>
            <template v-if="column.key === 'action'">
              <PermissionButton
                size="small"
                type="link"
                danger
                :popConfirm="{
                  title: `确认删除？`,
                  onConfirm: () => handleDel(record.id),
                }"
              >
                <AIcon type="DeleteOutlined" />
              </PermissionButton>
            </template>
          </template>
        </j-table>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Relational from './Relational.vue'
import { treeFilter } from 'jetlinks-ui-components/es/Tree'
import { defaultColumns, leftData, iconType } from './const'
import { DataSourceProps } from '../types'
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

// const bordered = ref(false)
const infoState: any = inject('infoState')
// 筛选关键字
const searchText = ref<string>('')
const active = ref<string>('')

// 选中的树节点
const selectedKeys = ref<string[]>([])
// 表格数据
const dataSource = ref<DataSourceProps[]>([])
// 当前var数据
const currentVar = ref<any>([])

const columns = computed(() => {
  const _columns = defaultColumns(props.type, infoState.isNode)
  return infoState.hasWeight
    ? _columns
    : _columns.filter((item) => item.key !== 'weight')
})

const dimensionsColor = {
  org: '#315efb',
  user: '#315efb',
  role: '#315efb',
  var: '#f8c051',
  relation: '#ba97fa',
}

const treeData = computed(() => {
  return active.value === 'var'
    ? currentVar.value
    : infoState.dataMap.value.get(active.value) ?? []
})

const treeDataCom = computed(() => {
  return searchText.value
    ? treeFilter(treeData.value, searchText.value, 'name')
    : treeData.value
})

const onSearch = (value: string) => {
  //   filterData.value = value
  //     ? treeFilter(treeData.value, value, 'name')
  //     : treeData.value
}

/**
 * 处理树结构
 * @param data
 */
const setLevel = (data: any[]) => {
  const cloneData = cloneDeep(data)
  function dealData(cloneData: any, level: number = 1) {
    cloneData.forEach((item) => {
      item.level = level
      item.id = item.fullId
      // item.type = item.others?.type || ''
      item.relation = item.others?.relation || ''
      // if (level !== 4) {
      //   item.disabled = true
      // }
      if (item.children && item.children.length > 0) {
        item.disabled = true
        dealData(item.children, level + 1)
      }
    })
  }
  dealData(cloneData)
  return props.type === 'user'
    ? cloneData
    : cloneData.filter((i) => i.id !== 'task')
}

const onSelect = (keys: string[], { node, selected }) => {
  if (!selected) return
  selectedKeys.value = [...keys]
  const index = dataSource.value.findIndex(
    (i) => i.id === (active.value === 'var' ? node.fullId : node.id),
  )
  if (index === -1) {
    dataSource.value.push({
      id: active.value === 'var' ? node.fullId : node.id,
      name: active.value === 'var' ? node.fullName : node.name,
      weight: infoState.hasWeight ? 1 : undefined,
      type: props.type,
      groupField: infoState.isNode ? active.value : undefined,
      // groupField: active.value,
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
    id: `${subject.fullId}-${data.relation}`,
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

watch(
  () => props.type,
  () => {
    active.value = props.type
    searchText.value = ''
    if (infoState.isNode) {
      const tree = treeFilter(
        setLevel(infoState.dataMap.value.get('var')),
        props.type,
        'relation',
      )
      currentVar.value = tree
    }
  },
  { immediate: true },
)

watch(
  () => [props.type, infoState.members],
  () => {
    if (!infoState.isNode) return
    dataSource.value = infoState.members.value.filter(
      (i) => i.type === props.type,
    )
    selectedKeys.value = dataSource.value.map((item) => item.id)
  },
  { immediate: true },
)

watch(
  () => infoState.members,
  (val) => {
    if (!infoState.isNode) {
      dataSource.value = [...val.value]
      selectedKeys.value = dataSource.value.map((item) => item.id)
    }
  },
  { immediate: true },
)

defineExpose({
  dataSource,
})
</script>
<style scoped lang="less">
.content {
  display: inline-flex;
  height: 100%;

  .content-left {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 10px;
    .radio {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 248px;
      .ant-radio-button-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 117px;
        border: none;
        border-radius: 2px;
        cursor: pointer;
        background-color: #e9ecf1;
        &.selected {
          border: none;
          background: v-bind('dimensionsColor[active]');
          .icon {
            color: v-bind('dimensionsColor[active]');
            background: #fff;
          }
          .text {
            .left-item-title,
            .description {
              color: #fff;
            }
          }
        }
        &::before {
          content: none;
        }

        .icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #dee2eb;
          color: #226aff;
          font-size: 20px;
        }
        .text {
          .left-item-title {
            font-size: 18px;
            font-weight: 500;
            color: #333333;
          }
          .description {
            font-size: 14px;
            color: #666666;
          }
        }
      }
    }
  }

  .content-center {
    // width: 60%;
    width: 472px;
    height: 366px;
    overflow: auto;
    // min-width: 200px;
    border: 1px solid #e0e0e0;
    .center-tree {
      padding: 16px 27px 16px 13px;
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
          line-height: 32px;
        }
      }
    }
  }

  .content-right {
    border: 1px solid #e0e0e0;
    border-left: none;
    // width: 40%;
    width: 306px;
    height: 366px;
    .right-top {
      display: inline-flex;
      justify-content: space-between;
      gap: 8px;
      align-items: center;
      width: 100%;
      height: 32px;
      padding: 0 12px;
      margin-bottom: 10px;
      background-color: #f2f2f2;
      .selected {
        .num {
          color: #315efb;
        }
      }
    }
    .table-row {
      padding: 0 10px;

      :deep(.table-del) td {
        background-color: #fde8ea;
        color: #e50012;
      }

      :deep(.ant-table-thead > tr > th) {
        background-color: #e9ecf1;
      }
      :deep(.name) {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        .name-text {
          width: 90%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      :deep(.type) {
        width: 4px;
        height: 16px;
        border-radius: 1px;
      }
    }
  }
}
</style>
