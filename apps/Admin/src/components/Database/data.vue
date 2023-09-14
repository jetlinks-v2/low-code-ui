<template>
  <div class="data-warp">
    <div class="tips">
      正在查看 {{ project.info.version }} 发布版本下的 {{total}} 条数据
    </div>
    <div class="table">
      <j-pro-table
        model="TABLE"
        :columns="myColumns"
        :request="getData"
        :scroll="{x: 1300, y: 500}"
      />
    </div>
  </div>
</template>

<script setup name="CRUDDataSetting">
import { CRUD_COLUMNS } from "@/components/Database/util";
import { queryRuntime } from '@/api/form'
import { useProduct } from '@/store'

const props = defineProps({
  id: {
    type: String,
    default: undefined
  },
  parentId: {
    type: String,
    default: undefined
  }
})

const columns = inject(CRUD_COLUMNS)

const project = useProduct()
const total = ref(0)

const myColumns = computed(() => {
  return columns.value.map(item => {
    if (item.width) {
      return item
    }
    return {
      ...item,
      width: 140,
      ellipsis: true,
    }
  })
})
const getData = async (params) => {
  const resp = await queryRuntime(project.info.id, props.parentId, 'QueryPager', params)
  total.value = resp.result?.total || 0
  console.log(resp)
  return {
    ...resp
  }

}

</script>

<style scoped lang="less">
.data-warp {
  padding: 0 24px;
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
