<template>
  <div class="crud-warp">
    <j-spin tip="正在校验..." :spinning="loading">
      <j-tabs >
        <j-tab-pane key="1">
          <template #tab>
            表结构
            <j-badge v-if="errorDataTableLength" :count="errorDataTableLength" />
          </template>
          <DataTable
            ref="dataTableRef"
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
        <j-tab-pane key="3" >
          <template #tab>
            高级配置
            <j-badge v-if="errorTips.relation || errorTips.asset" :count="errorTips.asset + errorTips.relation" />
          </template>
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
          <j-button class="extra-check" @click="validate">校验</j-button>
        </template>
      </j-tabs>
    </j-spin>
  </div>
</template>

<script setup class="CRUDBase">
import { CRUD_COLUMNS } from "@/components/Database/util";
import DataTable from './table.vue'
import DataSetting from './data.vue'
import Advanced from './advanced.vue'
import { useProduct } from '@/store'
import { defaultSetting } from './setting'
import {executeReq} from "@/api/basis";

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
const dataTableRef = ref()

const project = useProduct()

provide(CRUD_COLUMNS, tableColumns)

const ownerId = computed(() => {
  return `${project.info?.id}.${props.parentId}.${props.id}`
})

const tableName = ref(props.configuration.tableName)
const columns = ref(props.configuration.columns || defaultSetting)
const relation = ref(props.configuration.relation || {})
const asset = ref(props.configuration.asset || {})
const tree = ref(props.configuration.tree || false)

const loading = ref(false)

const update = () => {
  const { configuration, ...extra} = props
  if (errorTips.relation && (!relation.value.enabled || relation.value.assetIdColumn)) {
    errorTips.relation = 0
  }

  if (errorTips.asset && (!asset.value.enabled || asset.value.assetIdColumn)) {
    errorTips.asset = 0
  }

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

const errorTips = reactive({
  dataTable: {}
})

const errorDataTableLength = computed(() => {
  return Object.keys(errorTips.dataTable).length
})

const tableValidates = async () => {
  try {
    const resp = await dataTableRef.value.validates()
    errorTips.dataTable = {}
  } catch (e) {
    errorTips.dataTable = e
  }


  const res = await executeReq('rdb-crud', 'CheckTableName', { tableName: tableName.value, ownerId: ownerId.value }).finally(() => loading.value = false)
  if (res.success && res.result) {
    errorTips.dataTable['tableName'] = 1
  } else {
    delete errorTips.dataTable['tableName']
  }
  loading.value = false
}

const validate = async () => {
  loading.value = ref(true)
  errorTips.relation = 0
  errorTips.asset = 0

  if (relation.value.enabled && !relation.value.relationType) {
    errorTips.relation = 1
  }

  if (asset.value.enabled && !asset.value.assetIdColumn) {
    errorTips.asset += 1
  }

  await tableValidates()
}

defineExpose({
  validate: () => {
    return new Promise(async (resolve, reject) => {
      await validate()
      !Object.keys(errorTips.dataTable).length && !(errorTips.relation + errorTips.asset) ? resolve() : reject(errorTips)
    })
  }
})

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
