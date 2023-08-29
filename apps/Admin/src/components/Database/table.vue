<template>
  <div class="crud-table crud-content">
    <div class="crud-query">
      <j-input v-model:value="tableName" placeholder="表名" @change="tableNameChange" />
    </div>
    <QuickEditTable
      serial
      :data="dataSource"
      :columns="myColumns"
      :height="500"
      :scroll="{x: 1300, y: 500}"
    >
      <template #serial="{record, index}">
        <div class="serial">
          <AIcon type="KeyOutlined" :class="{primary: index === 1}" />
          <span>{{ index }}</span>
        </div>
      </template>
      <template #name="{record, index}">
        <span v-if="index <= maxLen">{{ record.name }}</span>
        <j-input v-else v-model:value="record.name" @change="() => { alias(record.name, record) }" />
      </template>
      <template #comment="{record, index}">
        <span v-if="index <= maxLen">{{ record.comment }}</span>
        <j-input v-else v-model:value="record.comment" :maxLength="16"/>
      </template>
      <template #javaType="{record, index}">
        <span v-if="index <= maxLen">{{record.javaType}}</span>
        <JavaTypeSelect v-else v-model:value="record.javaType" @change="() => JavaTypeChange(record)" />
      </template>
      <template #jdbcType="{record, index}">
        <span v-if="index <= maxLen">{{record.jdbcType}}</span>
        <JdbcTypeSelect v-else v-model:value="record.jdbcType" :javaType="record.javaType" />
      </template>
      <template #length="{ record, index }">
        <span v-if="index <= maxLen">{{record.length}}</span>
        <j-input-number v-else v-model:value="record.length" :precision="0" style="width: 100%;" />
      </template>
      <template #scale="{ record, index }">
        <span v-if="index <= maxLen">{{record.scale}}</span>
        <j-input-number v-else v-model:value="record.scale" :precision="0" style="width: 100%;" />
      </template>
      <template #updatable="{ record }">
        <ReadOnly v-model:value="record.updatable" />
      </template>
      <template #setting="{ record, index }">
        <span v-if="index <= maxLen"></span>
        <template v-else>
          <j-tooltip
            v-if="!record.javaType || ['Boolean', 'DateTime'].includes(record.javaType)"
            :title=" ['Boolean', 'DateTime'].includes(record.javaType) ? '该javaType不支持配置' : '请先选择javaType'"
          >
            <j-button disabled>
              配置
            </j-button>
          </j-tooltip>
          <j-button v-else @click="() => settingClick(record, index)">
            配置
          </j-button>
        </template>

      </template>
      <template #action="{ record, index }">
        <j-space>
          <PermissionButton
            v-if="index > (maxLen ? maxLen - 1 : maxLen)"
            type="link"
            class="action-btn"
            :hasPermission="true"
            :tooltip="{ title: '新增'}"
            @click="() => add(index)"
          >
            <AIcon type="PlusSquareOutlined" />
          </PermissionButton>
          <PermissionButton
            v-if="index > maxLen"
            type="link"
            class="action-btn"
            :hasPermission="true"
            :tooltip="{ title: '复制'}"
            @click="() => copy(record, index)"
          >
            <AIcon type="CopyOutlined" />
          </PermissionButton>
          <PermissionButton
            v-if="index > maxLen"
            type="link"
            class="action-btn"
            :hasPermission="true"
            :tooltip="{ title: '删除'}"
            :popConfirm="{
              title: '确认删除？',
              onConfirm: () => deleteFn(index)
            }"
          >
            <AIcon type="DeleteOutlined" />
          </PermissionButton>
        </j-space>
      </template>
    </QuickEditTable>
    <SettingModal
      v-if="setting.visible"
      :data="setting.data"
      @cancel="settingCancel"
      @save="settingSave"
    />
  </div>
</template>

<script setup name="CRUDTable">
import {onlyMessage, upperCase} from "@/utils/comm";
import { executeReq } from '@/api/basis'
import { cloneDeep, debounce, omit } from 'lodash-es'
import { TYPE_PROVIDE, CRUD_COLUMNS } from "@/components/Database/util";
import { JavaTypeSelect, JdbcTypeSelect, SettingModal, ReadOnly } from './components'
import { provide } from 'vue'
import { defaultSetting, defaultTreeSetting } from './setting'

const props = defineProps({
  tree: {
    type: Boolean,
    default: false
  },
  columns: {
    type: Array,
    default: () => []
  },
  tableName: {

  }
})

const myColumns = [
  {
    title: '列',
    dataIndex: 'name',
    width: 200,
    tooltip: '蛇形命名'
  },
  {
    title: '别名',
    dataIndex: 'alias',
    tooltip: '驼峰命名',
    ellipsis: true,
    width: 200
  },
  {
    title: '注释',
    dataIndex: 'comment',
  },
  {
    title: 'javaType',
    dataIndex: 'javaType',
    width: 150
  },
  {
    title: 'jdbcType',
    dataIndex: 'jdbcType',
    width: 150
  },
  {
    title: '长度',
    dataIndex: 'length',
    width: 120
  },
  {
    title: '精度',
    dataIndex: 'scale',
    width: 120
  },
  {
    title: '只读',
    dataIndex: 'updatable',
    width: 80
  },
  {
    title: '其它配置',
    dataIndex: 'setting',
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 160
  },
]

const tableName = ref()
const maxLen = ref(defaultSetting.length)

const dataSource = ref(props.columns ? props.columns : defaultSetting)

const typesOptions = ref([])
const setting = reactive({
  visible: false,
  data: undefined
})

const CrudColumns = inject(CRUD_COLUMNS)

provide(TYPE_PROVIDE, typesOptions)

const dataSourceChange = () => {
  CrudColumns.value = dataSource.value.filter(item => item.name).map(item => ({
    dataIndex: item.name,
    title: item.comment
  }))
}

const updateDataSource = (record, index) => {
  const _record = omit(record, ['index', '_quick_id', 'offsetTop'])
  dataSource.value.splice(index, 0, _record)
  dataSourceChange()
}

const add = (index) => {
  const record = {
    column: undefined,
    alias: undefined,
    description: undefined,
    javaType: undefined,
    jdbcType: undefined,
    length: 10,
    precision: undefined,
    updatable: true,
  }
  updateDataSource(record, index)
}

const copy = (record, index) => {
  const cloneRecord = cloneDeep(record)
  if (cloneRecord.column) {
    cloneRecord.column = `${cloneRecord.column}_copy`
  }
  updateDataSource(cloneRecord, index)
}

const deleteFn = async (index) => {
  dataSource.value.splice(index, 1)
  dataSourceChange()
}

const JavaTypeChange = (record) => {
  record.jdbcType = undefined
}

const alias = (name, record) => {
  record.alias = upperCase(name)
}

const settingClick = (record) => {
  setting.data = cloneDeep(record)
  setting.visible = true
}

const settingCancel = () => {
  setting.data = {}
  setting.visible = false
}

const settingSave = (data) => {
  dataSource.value.splice(data.index - 1, 1, data)
  settingCancel()
}

const tableNameChange = debounce((e) => {
  executeReq('rdb-crud', 'CheckTableName', { tableName: e.target.value }).then(res => {
    console.log(res)
    if(res.success && res.result) {
      onlyMessage('', "warning")
    }
  })
}, 300)

const getTypes = () => {
  executeReq('rdb-crud', 'GetTypes').then(res => {
    if (res.success && res.result) {
      typesOptions.value = res.result
    }
  })
}

watch(() => props.tree, () => {
  const isTreeNow = dataSource.value.some(item => item.name === 'parent_id')
  const arr = JSON.parse(JSON.stringify(dataSource.value))

  if (props.tree) {
    if (!isTreeNow) {
      const other = arr.slice(5, arr.length )
      dataSource.value = defaultTreeSetting.concat(other)
      maxLen.value = 9
    }
  } else {
    if (isTreeNow) {
      dataSource.value = defaultSetting.concat(arr.slice(9, arr.length))
      maxLen.value = 5
    }
  }
}, { immediate: true })

getTypes()
dataSourceChange()

</script>

<style scoped lang="less">
.crud-table {
  .crud-query {
    width: 400px;
    margin-bottom: 24px;
  }
  :deep(.action-btn) {
    padding: 4px 8px !important;
  }

  .serial {
    display: flex;
    justify-content: space-between;
    align-items: center;

    :deep(.anticon-key) {
      transform: rotate(-45deg);
      font-size: 16px;
      color: #7f7f7f;
    }

    .primary {
      color: #fa8c16;
    }
  }
}
</style>
