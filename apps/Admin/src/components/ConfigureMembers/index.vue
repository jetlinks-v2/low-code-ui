<template>
  <div class="member">
    <a-form-item-rest>
      <j-button class="btn" @click="visible = true">
        <span>选择成员</span>
        <span class="icon"  v-show="list.length > 0">
          <img :src="getImage('/check.png')" />
        </span>
      </j-button>
      <!-- 列表 -->
      <j-scrollbar max-height="172px">
        <j-list
          v-show="list.length > 0"
          :grid="{ gutter: 8, column: column }"
          :data-source="list"
          size="small"
          :split="false"
        >
          <template #renderItem="{ item }">
            <j-list-item>
              <j-ellipsis line-clamp="1">
                <AIcon type="CheckSquareFilled" style="font-size: 14px"></AIcon>
                {{ item.name }}
              </j-ellipsis>
            </j-list-item>
          </template>
        </j-list>
      </j-scrollbar>
      <Dialog
        v-if="visible"
        v-model:visible="visible"
        :isNode="isNode"
        :iconType="iconType"
        @get-data="getData"
      />
    </a-form-item-rest>
  </div>
</template>
<script setup lang="ts">
import Dialog from './Dialog/index.vue'
import { DataSourceProps } from './types'
import { isArray, isObject, pick } from 'lodash-es'
import { getImage } from '@jetlinks/utils'

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

const visible = ref(false)

const iconType = {
  org: 'icon-fl-zuzhi',
  user: 'icon-pingzheng',
  role: 'icon-yonghu2'
}

const list = ref<DataSourceProps[]>([])
const getData = (data: DataSourceProps[], type: string) => {
  // 暂存其他维度数据
  const newList = list.value.filter((item) => item.type != type)
  list.value = [...data, ...newList]
  props.isNode
    ? emits('update:members', groupedData(list.value, 'groupField'))
    : emits('update:members', list.value)
}
/**
 * 根据分组字段对数组进行分组
 * @param arr 要分组的数据
 * @param field 分类字段
 */
const groupedData = (arr: any[], field: string) => {
  return arr.reduce((acc, curr) => {
    let key = curr[field]
    if (!acc[key]) {
      acc[key] = []
    }
    const { others, groupField, ...rest } = curr
    acc[key].push({ ...rest, ...others })
    return acc
  }, {})
}

provide('infoState', {
  members: list,
  nodeId: props.nodeId,
  isNode: props.isNode,
  hasWeight: props.hasWeight,
  supCancel: props.supCancel,
})

watch(
  () => props.members,
  (val) => {
    if (isArray(val)) {
      list.value = val
    } else if (isObject(val)) {
      let arr = []
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
      height: 40px;
      line-height: 40px;
      border-radius: 4px;
      background: #f6f7f9;
    }
  }
}
</style>
