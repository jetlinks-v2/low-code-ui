<template>
  <div class="data-warp">
    <div class="tips">
      正在查看 {{version}} 发布版本下的 {{dataSource.length}} 条数据
    </div>
    <div class="table">
      <j-pro-table
        model="TABLE"
        :columns="columns"
        :dataSource="dataSource"
        :scroll="{x: 1300, y: 500}"
      />
    </div>
  </div>
</template>

<script setup name="CRUDDataSetting">
import { CRUD_COLUMNS } from "@/components/Database/util";

const columns = inject(CRUD_COLUMNS)

const dataSource = ref([])
const version = ref('1.0.0')

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
