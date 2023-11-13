<template>
  <div class="data-warp">
    <div class="tips">
      <span v-if="published">
        正在查看 {{ deployTime }} 发布版本下的 {{total}} 条数据
      </span>
      <span v-else>
        暂无数据，请在项目发布后查看
      </span>
    </div>
    <div class="table" v-if="published">
      <j-pro-table
        model="TABLE"
        :columns="myColumns"
        :request="getData"
        :scroll="{x: 1300, y: 500}"
      >
      </j-pro-table>
    </div>
  </div>
</template>

<script setup name="CRUDDataSetting">
import { CRUD_COLUMNS } from "@/components/Database/util";
import { queryRuntime } from '@/api/form'
import { useProduct } from '@/store'
import {isArray, isBoolean, isObject} from "lodash-es";
import dayjs from "dayjs";

const props = defineProps({
  id: {
    type: String,
    default: undefined
  },
  parentId: {
    type: String,
    default: undefined
  },
  createTime: {
    type: String,
    default: undefined
  }
})

const columns = inject(CRUD_COLUMNS)

const project = useProduct()
const total = ref(0)
const deployTime = computed(() => {
  return timeFormat(project.info.deployTime)
})

const published = computed(() => {
  return project.published ? new Date(props.createTime).getTime() < project.info.deployTime : false
})

const timeFormat = (t) => {
  console.log(t)
  return dayjs(t).format('YYYY-MM-DD HH:mm:ss')
}

const myColumns = computed(() => {
  return columns.value.map(item => {
    item.dataIndex = item.alias

    if (item.width) {
      return item
    }
    return {
      ...item,
      dataIndex: item.alias,
      width: 140,
      ellipsis: true,
    }
  })
})
const getData = async (params) => {
  const resp = await queryRuntime(project.info.id, props.parentId, 'QueryPager', params)
  total.value = resp.result?.total || 0
  if (resp?.result?.data && resp?.result?.data?.length) {
    resp.result.data = resp.result.data.map(item => {
      Object.keys(item).forEach(k => {
        const v = item[k]
        if (isArray(v) || isObject(v)) {
          item[k] = JSON.stringify(v)
        }
        if(isBoolean(v)) {
          item[k] = `${v}`
        }
        if (['createTime', 'modifyTime'].includes(k)) {
          item[k] = dayjs(item[k]).format('YYYY-MM-DD HH:mm:ss')
        }
      })
      return item
    })
  }
  return {
    ...resp
  }

}

</script>

<style scoped lang="less">
.data-warp {
  .tips {
    color: #3f3f3f;
  }

  .table {

    :deep(.jtable-body-spin) {
      padding: 4px 0 0 0;
    }
  }
}
</style>
