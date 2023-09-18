<template>
  <div class="crud-table crud-content">
    <div class="crud-query">
      <j-form ref="queryForm" :model="formModel">
        <j-form-item name="tableName" :rules="tableNameRule" :validateFirst="true">
          <j-input v-model:value="formModel.tableName" placeholder="表名" @change="tableNameChange" />
        </j-form-item>
      </j-form>
    </div>
    <QuickEditTable
      serial
      validate
      ref="tableRef"
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
      <template #name="{record, index, valueChange}" >
        <span v-if="index <= maxLen">{{ record.name }}</span>
        <j-input v-else v-model:value="record.name" @change="() => { valueChange(record.name); alias(record.name, record) }" />
      </template>
      <template #comment="{record, index}">
        <span v-if="index <= maxLen">{{ record.comment }}</span>
        <j-input v-else v-model:value="record.comment" :maxLength="16" @change="emitUpdateDataSource"/>
      </template>
      <template #javaType="{record, index, valueChange}">
        <span v-if="index <= maxLen">{{record.javaType}}</span>
        <JavaTypeSelect v-else v-model:value="record.javaType" @change="() => { valueChange(record.javaType); JavaTypeChange(record)}" />
      </template>
      <template #jdbcType="{record, index, valueChange}">
        <span v-if="index <= maxLen">{{record.jdbcType}}</span>
        <JdbcTypeSelect v-else v-model:value="record.jdbcType" :javaType="record.javaType" @change="() => { valueChange(record.jdbcType);emitUpdateDataSource()}" />
      </template>
      <template #length="{ record, index }">
        <span v-if="index <= maxLen">{{record.length}}</span>
        <span v-else-if="!['DECIMAL','VARCHAR','LONGVARCHAR'].includes(record.jdbcType)"></span>
        <j-input-number v-else v-model:value="record.length" :min="0" :precision="0" :max="999999999999999" style="width: 100%;" @change="emitUpdateDataSource" />
      </template>
      <template #scale="{ record, index }">
        <span v-if="index <= maxLen || !['DECIMAL'].includes(record.jdbcType)">{{record.scale}}</span>
        <j-input-number v-else v-model:value="record.scale" :min="0" :precision="0" :max="999999999999999" style="width: 100%;" @change="emitUpdateDataSource" />
      </template>
      <template #updatable="{ record, index }">
        <ReadOnly v-model:value="record.updatable" @change="emitUpdateDataSource" :disabled="index <= maxLen" />
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
import { upperCase } from "@/utils/comm";
import { executeReq } from '@/api/basis'
import { cloneDeep, debounce, omit } from 'lodash-es'
import { TYPE_PROVIDE, CRUD_COLUMNS } from "@/components/Database/util";
import { JavaTypeSelect, JdbcTypeSelect, SettingModal, ReadOnly } from './components'
import { provide } from 'vue'
import { defaultSetting, defaultTreeSetting } from './setting'
import { regular } from '@jetlinks/utils'

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
    type: String,
    default: undefined
  },
  ownerId: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['update', 'update:columns'])

const myColumns = [
  {
    title: '列',
    dataIndex: 'name',
    width: 200,
    tooltip: '蛇形命名',
    form: {
      rules: {
        asyncValidator: (rule, value, callback, source) => {
          if (source.record.index > maxLen.value) {
            if (!value) {
              return Promise.reject('请输入列名')
            }

            if (!regular.isModalReg(value)) {
              return Promise.reject('请以小写字母开头，使用字母、数字和下划线完成命名')
            }

            const someName = dataSource.value.filter(item => item.index !== source.record.index).some(item => item.name === value)
            if (someName) {
              return Promise.reject('有重复列名')
            }
            return Promise.resolve()
          }
          return Promise.resolve()
        }
      }
    }
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
    width: 150,
    form: {
      rules: {
        asyncValidator: (rule, value) => {
          if (!value) {
            return Promise.reject('请选择javaType')
          }
          return Promise.resolve()
        }
      }
    }
  },
  {
    title: 'jdbcType',
    dataIndex: 'jdbcType',
    width: 150,
    form: {
      rules: {
        asyncValidator: (rule, value) => {
          if (!value) {
            return Promise.reject('请选择jdbcType')
          }
          return Promise.resolve()
        }
      }
    }
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

const tableRef = ref()
const queryForm = ref()
const formModel = reactive({
  tableName: undefined
})
const maxLen = ref(defaultSetting.length)

const dataSource = ref([])

const typesOptions = ref([])

const setting = reactive({
  visible: false,
  data: undefined
})

const CrudColumns = inject(CRUD_COLUMNS)

const tableNameRule = [{
  trigger: 'blur',
  validator: async (_, value) => {
    if (!value) {
      return Promise.reject('请输入表名')
    } else {
      const res = await executeReq('rdb-crud', 'CheckTableName', {
        tableName: value,
        ownerId: props.ownerId
      })
      if (res.success && res.result) {
        return Promise.reject('表名重复')
      }
    }
    return Promise.resolve();
  }
},
  {
    max: 16,
    message: '最多可输入16位字符'
  }
]

provide(TYPE_PROVIDE, typesOptions)

const dataSourceChange = () => {
  CrudColumns.value = dataSource.value.filter(item => item.name && item.javaType && item.jdbcType).map(item => ({
    dataIndex: item.name,
    title: item.comment
  }))
}

const emitUpdateDataSource = () => {
  const isTreeNow = dataSource.value[1].name === 'parent_id'
  let myValue = cloneDeep(dataSource.value)
  if (isTreeNow) { // 后端不需要defaultTreeSetting或者defaultSetting中的值，需要剔除
    myValue = myValue.slice(9, myValue.length )
  } else {
    myValue = myValue.slice(9, myValue.length )
  }
  emit('update:columns', myValue)
  emit('update')
}

const updateDataSource = (record, index) => {
  const _record = omit(record, ['index', '_quick_id', 'offsetTop'])
  dataSource.value.splice(index, 0, _record)
  // dataSourceChange()
  emitUpdateDataSource()
}

const add = (index) => {
  const record = {
    name: undefined,
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
  if (cloneRecord.name) {
    cloneRecord.name = `copy_${cloneRecord.name}`
  }

  updateDataSource(cloneRecord, index)
}

const deleteFn = async (index) => {
  dataSource.value.splice(index-1, 1)
  // dataSourceChange()
  emitUpdateDataSource()
}

const JavaTypeChange = (record) => {
  record.jdbcType = undefined
  switch(record.javaType) {
    case 'Enum':
      Object.assign(record, {
        dictionary: {
          dictionaryId: undefined,
          multiple: undefined
        },
        spec: undefined
      })
      break;
    case 'String':
    case 'Byte':
    case 'Long':
      Object.assign(record, {
        defaultValueSpec: {
          fixValue: undefined
        },
        validator: {
          provider: undefined,
          configuration: {
            message: undefined,
            group: []
          }
        },
        spec: undefined
      })
      break;
    case 'Double':
    case 'Int':
    case 'Float':
    case 'BigDecimal':
    case 'BigInteger':
      Object.assign(record, {
        defaultValueSpec: {
          fixValue: undefined
        },
        validator: {
          provider: undefined,
          configuration: {
            message: '数据格式错误',
            group: [],
            classType: record.javaType,
            regexp: undefined,
            min: undefined,
            max: undefined
          }
        },
        spec: undefined
      })
      break;
    case 'List':
      Object.assign(record, {
        others: {
          valueJavaType: undefined
        }
      })
      break;
    case 'Map':
      Object.assign(record, {
        others: {
          keyJavaType: undefined,
          valueJavaType: undefined
        },
      })
      break;
  }

  if (!['Double','BigDecimal','Float'].includes(record.javaType)) {
    record.scale = undefined
  }
  emitUpdateDataSource()
}

const alias = (name, record) => {
  record.alias = upperCase(name)
  emitUpdateDataSource()
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
  emitUpdateDataSource()
}

const tableNameChange = debounce((e) => {
  const _value = e.target.value
  emit('update:tableName', _value)
  emit('update')
}, 300)

const getTypes = () => {
  executeReq('rdb-crud', 'GetTypes').then(res => {
    if (res.success && res.result) {
      typesOptions.value = res.result
    }
  })
}

watch(() => props.tree, () => {
  console.log('watch', props.columns)
  if (dataSource.value.length) {
    const isTreeNow = dataSource.value[1].name === 'parent_id'
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
  } else { // 新增数据
    dataSource.value = props.tree ? [...defaultTreeSetting, ...props.columns] : [...defaultSetting, ...props.columns]
  }

}, { immediate: true })

watch(() => props.tableName, () => {
  formModel.tableName = props.tableName
}, { immediate: true })

watch(() => JSON.stringify(dataSource.value), () => {
  dataSourceChange()
}, { immediate: true })

defineExpose({
  validates: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const v = await tableRef.value?.validates()
        const r = await queryForm.value?.validate()
        resolve(v)
      } catch (e) {
        reject(e)
      }
    })
  }
})

getTypes()
dataSourceChange()

</script>

<style scoped lang="less">
.crud-table {
  .crud-query {
    width: 400px;
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
