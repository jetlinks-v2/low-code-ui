<template>
  <div class="crud-warp" ref="warpRef">

      <div class="crud-header">
        <div class="crud-tabs">
          <j-badge :count="errorDataTableLength" >
            <div :class="{'crud-tabs-item': true, 'active': activeKey === 'table'}" @click=" activeKey = 'table'">
              表结构
            </div>
          </j-badge>
          <div :class="{'crud-tabs-item': true, 'active': activeKey === 'data'}" @click=" activeKey = 'data'">
            数据
          </div>
          <j-badge :count="errorRelationLength" >
            <div :class="{'crud-tabs-item': true, 'active': activeKey === 'adv'}" @click=" activeKey = 'adv'">
              高级配置
            </div>
          </j-badge>
        </div>
        <j-button class="extra-check" type="primary" @click="validate">校验</j-button>
      </div>
      <div class="crud-body">
        <CardBox v-show="activeKey === 'table'" style="height: 100%">
          <DataTable

            ref="dataTableRef"
            v-model:tableName="tableName"
            v-model:columns="columns"
            :tree="tree"
            :ownerId="ownerId"
            :publishColumns="publishColumns"
            @update="update"
          />
        </CardBox>
        <CardBox v-show="activeKey === 'data'" style="height: 100%">
          <DataSetting

            :id="props.id"
            :createTime="others?.createTime"
            :parentId="props.fullId"
          />
        </CardBox>
        <div style="height: 100%;" v-show="activeKey === 'adv'">
          <j-scrollbar>
            <Advanced

              ref="advancedRef"
              v-model:tree="tree"
              v-model:asset="asset"
              v-model:relation="relation"
              v-model:audit="audit"
              :id="props.id"
              :parentId="props.parentId"
              @update="update"
            />
          </j-scrollbar>
        </div>

      </div>
    <CheckSpin :spinning="loading" />
  </div>
</template>

<script setup class="CRUDBase">
import {CRUD_COLUMNS, WARP_REF} from "@LowCode/components/Database/util";
import DataTable from './table.vue'
import DataSetting from './data.vue'
import Advanced from './advanced.vue'
import { useProduct } from '@LowCode/store'
import { defaultSetting } from './setting'
import {onlyMessage} from "@LowCode/utils/comm";
import { useRequest } from '@jetlinks-web/hooks'
import {executeReq} from "@LowCode/api/basis";
import { CardBox , CheckSpin} from '@LowCode/components/index'

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
  fullId: {
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
  },
  showTip: {
    type: Boolean,
    default: true
  }
})

const tableColumns = ref([])
const dataTableRef = ref()
const advancedRef = ref()
const warpRef = ref()
const activeKey = ref('table')

const project = useProduct()

const { data: publishColumns, run } = useRequest(executeReq, {
  immediate: false,
  onSuccess(resp) {
    return resp.result.map?.(item => item.id) || []
  }
})

provide(CRUD_COLUMNS, tableColumns)
provide(WARP_REF, warpRef)

const ownerId = computed(() => {
  const stId = project.info?.id === props.parentId ? [project.info?.id,project.info?.id] : [project.info?.id,project.info?.id,props.parentId]
  return `${stId.join('.')}.${props.id}`
})

const tableName = ref(props.configuration.tableName)
const columns = ref(props.configuration.columns || defaultSetting)
const relation = ref(props.configuration.relation || {})
const audit = ref(props.configuration.audit || false)
const asset = ref(props.configuration.asset || {})
const tree = ref(props.configuration.tree || false)

const loading = ref(false)

const update = () => {
  const { configuration, ...extra} = props

  if (errorTips.relation && (!relation.value.enabled || relation.value.assetIdColumn)) {
    errorTips.relation = []
  }
  console.log(extra)
  project.update({
    ...extra,
    configuration: {
      tableName: tableName.value,
      relation: relation.value,
      columns: columns.value,
      asset: asset.value,
      tree: tree.value,
      audit: audit.value,
    },
  })
}

const errorTips = reactive({
  dataTable: {},
  relation: []
})

const errorDataTableLength = computed(() => {
  return errorTips.dataTable ? Object.keys(errorTips.dataTable).length : 0
})

const errorRelationLength = computed(() =>{
  return errorTips.dataTable ? Object.keys(errorTips.relation).length : 0
})

if (props.configuration?.tableName) {
  run('rdb-crud', 'GetColumns', { tableName: props.configuration?.tableName})
}

const validate = async () => {
  loading.value = true
  errorTips.relation = {}
  let validateStatus = false

  try {
    await advancedRef.value.validates()
    errorTips.relation = {}
  } catch (e) {
    errorTips.relation = e
    validateStatus = true
  }

  try {
    await dataTableRef.value.validates()
    errorTips.dataTable = {}
  } catch (e) {
    errorTips.dataTable = e || {}
    validateStatus = true
  }

  loading.value = false

  if (props.showTip && !validateStatus) {
    onlyMessage('校验通过')
  }
}

defineExpose({
  validate: () => {
    return new Promise(async (resolve, reject) => {

      await validate()
      const err = []

      if(Object.keys(errorTips.relation).length) {
        Object.values(errorTips.relation).forEach(a => {
          err.push({ message: a})
        })
      }

      if(Object.keys(errorTips.dataTable).length) {
        Object.values(errorTips.dataTable).forEach(a => {
          err.push(a[0])
        })
      }
      !err.length ? resolve() : reject(err)
    })
  }
})

</script>

<style scoped lang="less">
.crud-warp {
  height: 100%;
  position: relative;
  width: 100% !important;

  .loading {
    height: 100%;
    :deep(.ant-spin-container) {
      height: 100%;
    }
  }

  .crud-header {
    padding: 4px 24px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #D9D9D9;

    .crud-tabs {
      display: flex;
      gap: 8px;

      .crud-tabs-item {
        width: 98px;
        text-align: center;
        border-radius: 4px;
        line-height: 32px;
        cursor: pointer;
        transition: all .3s ease-in;

        &.active {
          color: #315EFB;
          background-color: #E4EAFF;
        }
      }
    }
  }

  .crud-body {
    height: calc(100% - 42px);
    background-color: rgb(246,246,246);
    padding: 24px;
  }
}
</style>
