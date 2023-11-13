<template>
  <div class="member">
    <a-form-item-rest>
      <j-button class="btn" type="text" @click="visible = true">
        <span>选择成员</span>
        <span class="icon" v-show="initList.length > 0">
          <img :src="getImage('/members/check.png')" />
        </span>
      </j-button>
      <!-- 列表 -->
      <j-scrollbar max-height="172px">
        <j-list
          v-show="initList.length > 0"
          :grid="{ gutter: 8, column: column }"
          :data-source="initList"
          size="small"
          :split="false"
        >
          <template #renderItem="{ item }">
            <j-list-item :class="{ 'is-del': item.isDel }">
              <j-space class="item-item">
                <AIcon :type="iconType[item.type]" class="a-icon" />
                <!-- v-if="isDel(item)" -->

                <j-ellipsis line-clamp="1">
                  {{ item.name }}
                </j-ellipsis>
                <j-tooltip v-if="item.isDel">
                  <template #title
                    >{{
                      item.type === 'org'
                        ? '组织'
                        : item.type === 'user'
                        ? '用户'
                        : '角色'
                    }}不存在</template
                  >
                  <AIcon
                    v-if="item.isDel"
                    type="ExclamationCircleFilled"
                    class="war-icon"
                  />
                </j-tooltip>
              </j-space>
            </j-list-item>
          </template>
        </j-list>
      </j-scrollbar>
      <Dialog
        v-if="visible"
        v-model:visible="visible"
        :isNode="isNode"
        @get-data="getData"
      />
    </a-form-item-rest>
  </div>
</template>
<script setup lang="ts">
import Dialog from './Dialog/index.vue'
import { DataSourceProps } from './types'
import { isArray, isObject, pick, uniqBy } from 'lodash-es'
import { getImage } from '@jetlinks/utils'
import { iconType } from './components/const'
import {
  getAllDepartment_api,
  getAllUser_api,
  getAllRole_api,
} from '@/api/user'
import { getVar_api, getAllRelation_api } from '@/api/member'
import { detail_api } from '@/api/process/model'
import { cloneDeep, omit } from 'lodash-es'
import { useFlowStore } from '@/store/flow'

const props = withDefaults(
  defineProps<{
    isNode?: boolean
    hasWeight?: boolean
    members: DataSourceProps[] | DataSourceProps | undefined
    nodeId?: string // 节点id
    supCancel?: boolean // 是否支持取消选中
    column?: number
  }>(),
  {
    isNode: true,
    hasWeight: true,
    supCancel: true,
    column: 3,
  },
)

const emits = defineEmits<{
  (e: 'update:members', data: DataSourceProps[] | DataSourceProps): void
}>()

const route = useRoute()
const flowStore = useFlowStore()

const visible = ref(false)

const list = ref<DataSourceProps[]>([])
const initList = computed(() => {
  const arr = list.value?.map((i) => ({ ...i, isDel: isDel(i) }))
  if (props.isNode) {
    emits('update:members', groupedData(arr, 'groupField'))
  }else{
    emits('update:members', arr)
  }
  return arr
})
// 固定/变量/关系数据
const dataMap = ref<Map<string, any>>(new Map())
// 成员中的关系数据
const relationList = ref<string[]>([])
// 查询到的现存关系数据
const existingRel = ref<any[]>([])

const getData = (data: DataSourceProps[], type: string) => {
  if (props.isNode) {
    // 暂存其他维度数据
    const newList = list.value.filter((item) => item.type != type)
    list.value = uniqBy([...data, ...newList], 'id')
    // emits('update:members', groupedData(list.value, 'groupField'))
  } else {
    // 基础信息
    const arr = data.map((i) => omit(i))
    list.value = uniqBy([...arr], 'id')
    // emits('update:members', list.value)
  }
}
/**
 * 根据分组字段对数组进行分组
 * @param arr 要分组的数据
 * @param field 分类字段
 */
const groupedData = (array: any[], field: string) => {
  const arr = cloneDeep(array)
  return arr.reduce((acc, curr) => {
    let key = curr[field]
    if (!acc[key]) {
      acc[key] = []
    }
    const { others, groupField, ...rest } = curr
    acc[key].push({ ...others, ...rest })
    return acc
  }, {})
}

/**
 * 判断是否删除
 * @param row 行数据
 */
const isDel = (row) => {
  const key = props.isNode ? 'groupField' : 'type'
  if (!dataMap.value.get(row[key])) return false
  return !searchIdInTree(dataMap.value.get(row[key]), row.id, row[key])
}
// 查是否存在
const searchIdInTree = (tree: any, id: string, type: string) => {
  const arr = id.split('-')
  // 遍历每个节点
  for (const node of tree) {
    if (
      (type === 'relation' &&
        node.fullId === arr[0] &&
        existingRel.value.includes(arr[1])) ||
      node.id === id ||
      node.fullId === id
    ) {
      return true
    }
    if (node.children && node.children.length > 0) {
      const found = searchIdInTree(node.children, id, type)
      if (found) {
        return true
      }
    }
  }
  return false
}

const getTreeData = () => {
  const apiList = [
    getAllDepartment_api({
      paging: false,
      sorts: [
        {
          name: 'sortIndex',
          order: 'asc',
        },
      ],
    }),
    getAllUser_api({
      paging: false,
      sorts: [
        {
          name: 'createTime',
          order: 'desc',
        },
      ],
    }),
    getAllRole_api({
      paging: false,
      sorts: [
        {
          name: 'createTime',
          order: 'desc',
        },
        {
          name: 'id',
          order: 'desc',
        },
      ],
    }),
  ]
  Promise.all(apiList).then((res) => {
    dataMap.value.set(
      'org',
      res[0].result.sort((a: any, b: any) =>
        a.sortIndex === b.sortIndex
          ? b.createTime - a.createTime
          : a.sortIndex - b.sortIndex,
      ),
    )
    dataMap.value.set('user', res[1].result)
    dataMap.value.set('role', res[2].result)
  })
}

onMounted(() => {
  if (props.nodeId) {
    detail_api(route.query.id as string).then((res) => {
      if (res.success) {
        getTree(res.result)
      }
    })
  }
})

/**
 * 获取变量，关系的树
 */
const getTree = (data: any) => {
  const param = {
    definition: {
      ...data,
      model: JSON.stringify(flowStore.model),
    },
    nodeId: props.nodeId,
    containThisNode: props.nodeId === 'ROOT_1',
  }
  getVar_api(param).then((res) => {
    if (res.success) {
      dataMap.value.set('var', res.result)
      dataMap.value.set('relation', res.result)
    }
  })
}

const getRelation = async () => {
  if (relationList.value.length < 1) return
  const res = await getAllRelation_api({
    paging: false,
    terms: [
      {
        value: relationList.value,
        termType: 'in',
        column: 'relation',
      },
    ],
  })

  if (res.success) {
    existingRel.value = res.result.map((i) => i.relation)
  }
}

getTreeData()

provide('infoState', {
  dataMap: dataMap,
  members: initList,
  nodeId: props.nodeId,
  isNode: props.isNode,
  hasWeight: props.hasWeight,
  supCancel: props.supCancel,
})

watch(
  () => props.members,
  (val) => {
    if(list.value.length > 0) return
    if (isArray(val)) {
      list.value = val
    } else if (isObject(val)) {
      let arr = []
      relationList.value =
        val['relation']?.map((i) => i.related?.relation) || []
      getRelation()
      Object.keys(val).forEach((i) => {
        arr = arr.concat(
          val[i]?.map((j) => ({
            ...pick(j, ['id', 'name', 'weight']),
            type: j.type || j.related?.objectType,
            groupField: i,
            others: {
              ...j,
            },
          })),
        )
      })
      list.value = arr
    }
  },
  { immediate: true },
)

</script>
<style scoped lang="less">
.member {
  width: 100%;
  .btn {
    width: 100%;
    position: relative;
    // width: 496px;
    margin-bottom: 8px;
    background: #f3f3f3;
  }
  .icon {
    position: absolute;
    top: -4px;
    right: 0;
    > img {
      width: 20px;
      height: 20px;
    }
  }

  :deep(.ant-list) {
    overflow: hidden;
    .ant-list-item {
      cursor: pointer;
      position: relative;
      height: 40px;
      line-height: 40px;
      border-radius: 4px;
      background: #f6f7f9;
      .war-icon {
        position: absolute;
        top: 13px;
        right: 8px;
        font-size: 16px;
        color: #eb636f;
      }
      .a-icon {
        font-size: 16px;
        color: #226aff;
      }
    }
    .is-del {
      // background: #fde8ea;
      color: #999999;
      .a-icon {
        color: #999999;
      }
    }
  }
}
</style>
