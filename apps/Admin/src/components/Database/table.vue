<template>
  <div class="crud-table crud-content">
    <div class="crud-query">
      <j-form ref="queryForm" :model="formModel">
        <j-form-item name="tableName" :rules="tableNameRule" :validateFirst="true">
          <j-input v-model:value="formModel.tableName" placeholder="表名" @change="tableNameChange" />
        </j-form-item>
      </j-form>
    </div>
    <div style="height: calc(100% - 60px)">
      <QuickEditTable
        serial
        validate
        ref="tableRef"
        :data="dataSource"
        :columns="myColumns"
        :height="500"
        :scroll="{x: 1600, y: 500}"
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
        <template #comment="{record, index, valueChange}">
          <span v-if="index <= maxLen">{{ record.comment }}</span>
          <j-input v-else v-model:value="record.comment" :maxLength="16" @change="() => { valueChange(record.comment); emitUpdateDataSource()}"/>
        </template>
        <template #javaType="{record, index, valueChange}">
          <span v-if="index <= maxLen">{{record.javaType}}</span>
          <JavaTypeSelect v-else v-model:value="record.javaType" @change="() => { valueChange(record.javaType); JavaTypeChange(record)}" :disabled="publishColumns.includes(record.alias)"/>
        </template>
        <template #jdbcType="{record, index, valueChange}">
          <span v-if="index <= maxLen">{{record.jdbcType}}</span>
          <JdbcTypeSelect v-else v-model:value="record.jdbcType" :javaType="record.javaType" @change="() => { valueChange(record.jdbcType);emitUpdateDataSource()}" :disabled="publishColumns.includes(record.alias)" />
        </template>
        <template #length="{ record, index }">
          <span v-if="index <= maxLen">{{record.length}}</span>
          <span v-else-if="!['DECIMAL','VARCHAR','LONGVARCHAR'].includes(record.jdbcType)"></span>
          <j-input-number v-else v-model:value="record.length" :min="0" :precision="0" :max="999999999999999" style="width: 100%;" @change="emitUpdateDataSource" :disabled="publishColumns.includes(record.alias)" />
        </template>
        <template #scale="{ record, index }">
          <span v-if="index <= maxLen || !['DECIMAL'].includes(record.jdbcType)">{{record.scale}}</span>
          <j-input-number v-else v-model:value="record.scale" :min="0" :precision="0" :max="999999999999999" style="width: 100%;" @change="emitUpdateDataSource" :disabled="publishColumns.includes(record.alias)" />
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
              <AIcon type="PlusCircleOutlined" />
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
              danger
              type="link"
              class="action-btn"
              placement="topRight"
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
    </div>
  </div>
  <SettingModal
    v-if="setting.visible"
    :data="setting.data"
    :warp="WarpRef"
    :publish="setting.data ? publishColumns.includes(setting.data.name) : false"
    @cancel="settingCancel"
    @save="settingSave"
  />
</template>

<script setup name="CRUDTable">
import { upperCase } from "@/utils/comm";
import { executeReq } from '@/api/basis'
import { cloneDeep, debounce, omit } from 'lodash-es'
import {
  TYPE_PROVIDE,
  CRUD_COLUMNS,
  WARP_REF,
  proAll,
  formErrorFieldsToObj,
  settingValidate
} from "@/components/Database/util";
import { JavaTypeSelect, JdbcTypeSelect, SettingModal, ReadOnly } from './components'
import { provide } from 'vue'
import { defaultSetting, defaultTreeSetting } from './setting'
import { regular } from '@jetlinks/utils'
import { useProduct } from '@/store'

const props = defineProps({
  tree: {
    type: Boolean,
    default: false
  },
  columns: {
    type: Array,
    default: () => []
  },
  publishColumns: {
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

const product = useProduct()

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
            if (typesOptions.value.some(item =>
              item.javaType === upperCase(value) ||
              item.javaType === (value.charAt(0).toUpperCase() + value.slice(1))
            )) {
              return Promise.reject('不能与保留字重名')
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
    form: {
      rules: {
        asyncValidator: (rule, value, cb, source) => {
          if (!value && source.record.index > maxLen.value) {
            return Promise.reject('请输入注释')
          }
          return Promise.resolve()
        }
      }
    }
  },
  {
    title: 'javaType',
    dataIndex: 'javaType',
    width: 150,
    form: {
      rules: {
        asyncValidator: (rule, value, cb, source) => {
          if (!value && source.record.index > maxLen.value) {
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
        asyncValidator: (rule, value, cb, source) => {
          if (!value && source.record.index > maxLen.value) {
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
    width: 100,
    form: {
      watch: ['other', 'dictionary'],
      rules: {
        asyncValidator: (rule, value, cb, source) => {
          if (source.record.index > maxLen.value) {
            return settingValidate(source.record)
          }
          return Promise.resolve()
        }
      }
    }
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
const WarpRef = inject(WARP_REF)

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
    alias: item.alias,
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
    myValue = myValue.slice(5, myValue.length )
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
    cloneRecord.alias = upperCase(cloneRecord.name)
  }

  updateDataSource(cloneRecord, index)
}

const deleteFn = async (index) => {
  const _value = dataSource.value[index-1]
  dataSource.value.splice(index-1, 1)
  // dataSourceChange()
  // 删除
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
          providerType: undefined,
          configuration: {
            message: '数据格式错误',
            group: ['save', 'update', 'insert']
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
            group: ['save', 'update', 'insert'],
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

const getKey = (type) => {
  switch (type) {
    case 'Enum':
      return 'dictionary'
    case 'List':
    case 'Map':
      return 'others'
  }
}

const settingSave = (data) => {
  dataSource.value.splice(data.index - 1, 1, data)
  const key = getKey(data.javaType)
  settingCancel()
  emitUpdateDataSource()
  if (key) {
    tableRef.value?.validateItem([data.index - 1, key])
  }
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
    const cloneTreeSetting = cloneDeep(defaultTreeSetting)
    const cloneSetting = cloneDeep(defaultSetting)
  if (dataSource.value.length) {
    const isTreeNow = dataSource.value[1].name === 'parent_id'
    const arr = JSON.parse(JSON.stringify(dataSource.value))
    if (props.tree) {
      if (!isTreeNow) {
        const other = arr.slice(5, arr.length )
        dataSource.value = cloneTreeSetting.concat(other)
        maxLen.value = 9
      }
    } else {
      if (isTreeNow) {
        dataSource.value = cloneSetting.concat(arr.slice(9, arr.length))
        maxLen.value = 5
      }
    }
  } else { // 新增数据
    maxLen.value = props.tree ? 9 : 5
    dataSource.value = props.tree ? [...cloneTreeSetting, ...props.columns] : [...cloneSetting, ...props.columns]
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
      proAll([
        tableRef.value?.validates,
        queryForm.value?.validate
      ]).then(r => {
        resolve(r)
      }).catch(e => {
        const errorMsg = {}
        console.log('table-validates',e)
        e.forEach(item => {
          if(item.errorFields) {
            Object.assign(errorMsg, formErrorFieldsToObj(item.errorFields))
          } else {
            Object.assign(errorMsg, item)
          }
        })
        reject(errorMsg)
      })
    })
  }
})

getTypes()
dataSourceChange()

</script>

<style scoped lang="less">
.crud-table {
  height: 100%;

  :deep(.quick-table-warp) {
    height: 100%;
  }
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
