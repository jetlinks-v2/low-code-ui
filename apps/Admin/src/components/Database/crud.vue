<template>
  <div class="crud-warp">
    <j-tabs >
      <j-tab-pane key="1" tab="表结构">
        <DataTable
          v-model:tableName="tableName"
          v-model:columns="columns"
          :tree="tree"
          :ownerId="ownerId"
          @update="update"
        />
      </j-tab-pane>
      <j-tab-pane key="2" tab="数据">
        <DataSetting
          :id="props.id"
          :parentId="props.parentId"
        />
      </j-tab-pane>
      <j-tab-pane key="3" tab="高级配置">
        <Advanced
          v-model:tree="tree"
          v-model:asset="asset"
          v-model:relation="relation"
          :id="props.id"
          :parentId="props.parentId"
          @update="update"
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
import { useProduct } from '@/store'
import { defaultSetting } from './setting'

const props = defineProps({
  configuration: {
    type: Object,
    default: () => ({})
  },
  provider: {
    type: String,
    default: undefined
  },
  title: {
    type: String,
    default: undefined
  },
  type: {
    type: String,
    default: undefined
  },
  parentId: {
    type: String,
    default: undefined
  },
  id: {
    type: String,
    default: undefined
  },
  others: {
    type: Object,
    default: () => ({})
  }
})

const tableColumns = ref([])
const project = useProduct()

provide(CRUD_COLUMNS, tableColumns)

const ownerId = computed(() => {
  return `${project.info?.projectId}.${props.parentId}.${props.id}`
})

const tableName = ref(props.configuration.tableName)
const columns = ref(props.configuration.columns || defaultSetting)
const relation = ref(props.configuration.relation || {})
const asset = ref(props.configuration.asset || {})
const tree = ref(props.configuration.tree || false)

const update = () => {
  const { configuration, ...extra} = props
  project.update({
    ...extra,
    configuration: {
      tableName: tableName.value,
      relation: relation.value,
      columns: columns.value,
      asset: asset.value,
      tree: tree.value,
    },
  })
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
