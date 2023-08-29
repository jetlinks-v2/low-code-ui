<template>
  <div class="crud-warp">
    <j-tabs >
      <j-tab-pane key="1" tab="表结构">
        <DataTable
          v-model:tableName="tableName"
          v-model:columns="columns"
          :tree="tree"
          @update="update"
        />
      </j-tab-pane>
      <j-tab-pane key="2" tab="数据">
        <DataSetting
        />
      </j-tab-pane>
      <j-tab-pane key="3" tab="高级配置">
        <Advanced
          v-model:tree="tree"
          v-model:asset="asset"
          v-model:relation="relation"
        />
      </j-tab-pane>
      <template #rightExtra>
        <j-button class="extra-check">校验</j-button>
      </template>
    </j-tabs>
  </div>
</template>

<script setup class="CRUDBase">
import { CRUD_COLUMNS } from "@/components/Database/util";
import DataTable from './table.vue'
import DataSetting from './data.vue'
import Advanced from './advanced.vue'

const props = defineProps({
  configuration: {
    type: Object,
    default: () => ({})
  },
  id: {
    type: String,
    default: undefined
  }
})

const tableColumns = ref([])

provide(CRUD_COLUMNS, tableColumns)

const tableName = ref(props.configuration.tableName)
const columns = ref(props.configuration.columns)
const relation = ref(props.configuration.relation)
const asset = ref(props.configuration.asset)
const tree = ref(props.configuration.tree || false)

const update = () => {

}
</script>

<style scoped lang="less">
.crud-warp {
  .crud-content {
    padding: 0 24px;
  }

  .extra-check {
    margin-right: 24px;
  }
}
</style>
