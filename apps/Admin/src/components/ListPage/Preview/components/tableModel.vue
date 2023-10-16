<template>
  <div>
    <JProTable
      ref="tableRef"
      :columns="columns"
      :request="props?.query"
      :pagination="props?.pagination"
      :model="model"
      :params="params"
      v-model:modelValue="tableForm"
      :scroll="{ x: '100%' }"
      :defaultParams="defaultParams"
      :rowSelection="
        isCheck
          ? {
              selectedRowKeys: _selectedRowKeys,
              onSelectNone,
              onSelect,
              onSelectAll
            }
          : false
      "
      @change="tableDataChange"
    >
      <template #headerTitle>
        <HeaderButton :headerActions="props.headerActions" ref="headerButton" />
      </template>
      <template #rightExtraRender v-if="showColumnOptions && tableForm === 'TABLE'">
        <j-space>
          <label>展示控制</label>
          <a-select
            style="width: 240px;"
            mode="multiple"
            :max-tag-count="3"
            v-model:value="showColumns"
            :options="options"
          >
            <template #tagRender="{ label }">
              <span class="select-tag" :title="label">{{ label.length > 2 ? label.substring(0, 2) + '...' : label }}</span>
            </template>
          </a-select>
        </j-space>
      </template>
      <template
        v-for="item in props?.dataColumns"
        :key="item.key"
        #[item.key]="slotProps"
      >
        <j-ellipsis
          v-if="item.key !== 'action'"
          :dataid="`${projectId}-${pageId}-${item.dataIndex}`"
          :class="extractCssClass(item.config?.specialStyle)"
        >
          <div v-if="item?.config">
            <StringFormat
              v-if="
                ['int', 'long', 'text', 'float', 'double', 'geoPoint'].includes(
                  item.config?.type,
                )
              "
              :config="item?.config"
              :value="slotProps[item.key]"
            />
            <DateFormat
              v-else-if="['date'].includes(item.config?.type)"
              :config="item?.config"
              :value="slotProps[item.key]"
            />
            <BooleanFormat
              v-else-if="['boolean'].includes(item.config?.type)"
              :config="item?.config"
              :value="slotProps[item.key]"
            />
            <FileFormat
              v-else-if="['file'].includes(item.config?.type)"
              :config="item?.config"
              :value="slotProps[item.key]"
            />
            <ArrayFormat
              v-else-if="['array'].includes(item.config?.type)"
              :config="item?.config"
              :value="slotProps[item.key]"
            />
            <ObjectFormat
              v-else-if="['object'].includes(item.config?.type)"
              :config="item?.config"
              :value="slotProps[item.key]"
            />
            <EnumFormat
              v-else-if="['enum'].includes(item.config?.type)"
              :config="item?.config"
              :value="slotProps[item.key]"
            />
            <StringFormat
              v-else
              :config="item?.config"
              :value="slotProps[item.key]"
            />
          </div>
          <span v-else>{{
            !isEmpty(slotProps[item.key]) ? slotProps[item.key] : '--'
          }}</span>
        </j-ellipsis>
        <div v-if="item?.key === 'action'">
          <OtherActions :actions="tableActions" :record="slotProps"></OtherActions>
          <!-- <j-space size="large">
            <PermissionButton
              v-for="item in tableActions"
              :key="item.key"
              type="link"
              v-bind:="handleFunction(item.permissionProps, slotProps)"
              style="padding: 0"
              :danger="item.command === 'Delete'"
              :popConfirm="
                handleFunction(item.permissionProps, slotProps)?.popConfirm
              "
              :class="extractCssClass(item.style)"
              :data-id="item.key"
            >
              <template v-if="item.icon">
                <img
                  :src="item.icon"
                  alt=""
                  v-if="item.icon.includes('http')"
                  class="image-icon"
                />
                <AIcon v-else :type="item?.icon" />
              </template>
            </PermissionButton>
          </j-space> -->
        </div>
      </template>
      <template #card="slotProps">
        <Card
          :status="slotProps[props?.cardConfig?.emphasisField]?.value || slotProps[props?.cardConfig?.emphasisField]"
          :actions="tableActions"
          :record="slotProps"
          :active="_selectedRowKeys.includes(slotProps.id)"
          :statusText="
            statusText(slotProps[props?.cardConfig?.emphasisField] || '')
          "
          :showStatus="!!props?.cardConfig?.emphasisField?.length"
          :statusNames="{
            online: 'processing',
            offline: 'error',
            notActive: 'warning',
          }"
          :statusColor="JSON.parse(props?.cardConfig.specialStyle || `{}`)"
          :popConfirm="
            handleFunction(slotProps.permissionProps, slotProps)?.popConfirm
          "
          @click="handleClick(slotProps)"
        >
          <template #img>
            <j-avatar
              v-if="isEmpty(props?.cardConfig?.dynamicIcon)"
              shape="square"
              :size="100"
              :src="props?.cardConfig?.customIcon"
            >
              <template #icon>
                <Image
                  src="/images/list-page/table-card-default.png"
                  :preview="false"
                />
              </template>
            </j-avatar>
            <j-avatar
              v-else
              shape="square"
              :size="100"
              :src="dynamicIconUrl(slotProps[props?.cardConfig?.dynamicIcon])"
              class="card-icon"
            >
              <template #icon>
                <Image
                  :src="
                    slotProps[props?.cardConfig?.dynamicIcon] ||
                    '/images/list-page/table-card-default.png'
                  "
                  :preview="false"
                />
              </template>
            </j-avatar>
          </template>
          <template #content>
            <j-row>
              <j-col :span="12">
                <j-ellipsis
                  style="
                    margin-bottom: 18px;
                    font-weight: bold;
                    font-size: 16px;
                  "
                >
                  <StringFormat
                    v-if="
                      [
                        'int',
                        'long',
                        'text',
                        'float',
                        'double',
                        'geoPoint',
                      ].includes(
                        valueFormat(props?.cardConfig?.field1)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field1)?.config"
                    :value="slotProps[props?.cardConfig?.field1]"
                  />
                  <DateFormat
                    v-else-if="
                      ['date'].includes(
                        valueFormat(props?.cardConfig?.field1)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field1)?.config"
                    :value="slotProps[props?.cardConfig?.field1]"
                  />
                  <BooleanFormat
                    v-else-if="
                      ['boolean'].includes(
                        valueFormat(props?.cardConfig?.field1)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field1)?.config"
                    :value="slotProps[props?.cardConfig?.field1]"
                  />
                  <FileFormat
                    v-else-if="
                      ['file'].includes(
                        valueFormat(props?.cardConfig?.field1)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field1)?.config"
                    :value="slotProps[props?.cardConfig?.field1]"
                  />
                  <ArrayFormat
                    v-else-if="
                      ['array'].includes(
                        valueFormat(props?.cardConfig?.field1)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field1)?.config"
                    :value="slotProps[props?.cardConfig?.field1]"
                  />
                  <EnumFormat
                    v-else-if="
                      ['enum'].includes(
                        valueFormat(props?.cardConfig?.field1)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field1)?.config"
                    :value="slotProps[props?.cardConfig?.field1]"
                  />
                  <ObjectFormat
                    v-else-if="
                      ['object'].includes(
                        valueFormat(props?.cardConfig?.field1)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field1)?.config"
                    :value="slotProps[props?.cardConfig?.field1]"
                  />
                  <StringFormat
                    v-else
                    :config="valueFormat(props?.cardConfig?.field1)?.config"
                    :value="slotProps[props?.cardConfig?.field1]"
                  />
                </j-ellipsis>
              </j-col>
              <j-col :span="12">
                <j-ellipsis>
                  <div class="emphasisField-text"></div>
                </j-ellipsis>
              </j-col>
            </j-row>

            <j-row>
              <j-col :span="12">
                <j-ellipsis>
                  <div>{{ props?.cardConfig?.field2Title }}</div>
                </j-ellipsis>
                <j-ellipsis>
                  <StringFormat
                    v-if="
                      [
                        'int',
                        'long',
                        'text',
                        'float',
                        'double',
                        'geoPoint',
                      ].includes(
                        valueFormat(props?.cardConfig?.field2)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field2)?.config"
                    :value="slotProps[props?.cardConfig?.field1]"
                  />
                  <DateFormat
                    v-else-if="
                      ['date'].includes(
                        valueFormat(props?.cardConfig?.field2)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field2)?.config"
                    :value="slotProps[props?.cardConfig?.field2]"
                  />
                  <BooleanFormat
                    v-else-if="
                      ['boolean'].includes(
                        valueFormat(props?.cardConfig?.field2)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field2)?.config"
                    :value="slotProps[props?.cardConfig?.field2]"
                  />
                  <FileFormat
                    v-else-if="
                      ['file'].includes(
                        valueFormat(props?.cardConfig?.field2)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field2)?.config"
                    :value="slotProps[props?.cardConfig?.field2]"
                  />
                  <ArrayFormat
                    v-else-if="
                      ['array'].includes(
                        valueFormat(props?.cardConfig?.field2)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field2)?.config"
                    :value="slotProps[props?.cardConfig?.field2]"
                  />
                  <EnumFormat
                    v-else-if="
                      ['enum'].includes(
                        valueFormat(props?.cardConfig?.field2)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field2)?.config"
                    :value="slotProps[props?.cardConfig?.field2]"
                  />
                  <ObjectFormat
                    v-else-if="
                      ['object'].includes(
                        valueFormat(props?.cardConfig?.field2)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field2)?.config"
                    :value="slotProps[props?.cardConfig?.field2]"
                  />
                  <StringFormat
                    v-else-if="props?.cardConfig?.field2"
                    :config="valueFormat(props?.cardConfig?.field2)?.config"
                    :value="slotProps[props?.cardConfig?.field2]"
                  />
                </j-ellipsis>
              </j-col>
              <j-col :span="12">
                <j-ellipsis>
                  <div>{{ props?.cardConfig?.field3Title }}</div>
                </j-ellipsis>
                <j-ellipsis>
                  <StringFormat
                    v-if="
                      [
                        'int',
                        'long',
                        'text',
                        'float',
                        'double',
                        'geoPoint',
                      ].includes(
                        valueFormat(props?.cardConfig?.field3)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field3)?.config"
                    :value="slotProps[props?.cardConfig?.field1]"
                  />
                  <DateFormat
                    v-else-if="
                      ['date'].includes(
                        valueFormat(props?.cardConfig?.field3)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field3)?.config"
                    :value="slotProps[props?.cardConfig?.field3]"
                  />
                  <BooleanFormat
                    v-else-if="
                      ['boolean'].includes(
                        valueFormat(props?.cardConfig?.field3)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field3)?.config"
                    :value="slotProps[props?.cardConfig?.field3]"
                  />
                  <FileFormat
                    v-else-if="
                      ['file'].includes(
                        valueFormat(props?.cardConfig?.field3)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field3)?.config"
                    :value="slotProps[props?.cardConfig?.field3]"
                  />
                  <ArrayFormat
                    v-else-if="
                      ['array'].includes(
                        valueFormat(props?.cardConfig?.field3)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field3)?.config"
                    :value="slotProps[props?.cardConfig?.field3]"
                  />
                  <EnumFormat
                    v-else-if="
                      ['enum'].includes(
                        valueFormat(props?.cardConfig?.field3)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field3)?.config"
                    :value="slotProps[props?.cardConfig?.field3]"
                  />
                  <ObjectFormat
                    v-else-if="
                      ['object'].includes(
                        valueFormat(props?.cardConfig?.field3)?.config?.type,
                      )
                    "
                    :config="valueFormat(props?.cardConfig?.field3)?.config"
                    :value="slotProps[props?.cardConfig?.field3]"
                  />
                  <StringFormat
                    v-else-if="props?.cardConfig?.field3"
                    :config="valueFormat(props?.cardConfig?.field3)?.config"
                    :value="slotProps[props?.cardConfig?.field3]"
                  />
                </j-ellipsis>
              </j-col>
            </j-row>
          </template>
        </Card>
      </template>
    </JProTable>
  </div>
</template>
<script setup lang="ts">
import Card from '@/components/Card'
import HeaderButton from '@/components/ListPage/Preview/components/HederActions.vue'
import { isFunction, isObject } from 'lodash-es'
import Image from '@/components/Image/index.vue'
import OtherActions from './OtherActions.vue'
import { PropType } from 'vue'
import {
  extractCssClass,
  insertCustomCssToHead,
} from '@/components/FormDesigner/utils/utils'
import {
  ArrayFormat,
  BooleanFormat,
  DateFormat,
  FileFormat,
  StringFormat,
  ObjectFormat,
  EnumFormat,
} from './ColumnFormat'
import { isEmpty } from '../../utils'
const props = defineProps({
  model: {
    type: String,
    default: 'card',
  },
  dataColumns: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  query: {
    type: Function,
    default: () => {},
  },
  pagination: {
    type: Object,
    default: () => {},
  },
  cardConfig: {
    type: Object,
    default: {
      customIcon: '',
      dynamicIcon: '',
      field2Title: '',
      field3Title: '',
      field1: '',
      field2: '',
      field3: '',
      emphasisField: '',
      specialStyle: '',
    },
  },
  headerActions: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  defaultFormType: {
    type: String,
    default: 'CARD',
  },
  tableActions: {
    type: Array as PropType<Record<string, any>>,
    default: () => [],
  },
  params: {
    type: Object,
    default: () => {},
  },
  projectId: {
    type: String,
    default: '',
  },
  pageId: {
    type: String,
    default: '',
  },
  showColumnOptions: {
    type: Boolean,
    default: false
  }
})

const tableForm = ref(props.defaultFormType)
const showColumns = ref<string[]>(props.dataColumns.map(item => {
  return item.key
}))

const options = computed(() => {
  return props.dataColumns.map(item => {
    return {
      label: item.title,
      value: item.key
    }
  })
})
const columns = computed(() => {
  const result = props.dataColumns.filter((item) => {
    return showColumns.value.includes(item.key)
  })
  return result
})
const headerButton = ref()

const isCheck = computed(() => {
  if (!headerButton.value?.isCheck) {
    _selectedRowKeys.value = []
  }
  return headerButton.value?.isCheck
})
const _selectedRowKeys = ref<string[]>([])

const defaultParams = reactive({
  sorts: [{ name: 'createTime', order: 'desc' }, { name: 'id', order: 'desc' }],
})

const onSelectNone = () => {
  _selectedRowKeys.value = []
}

const onSelect = (record, selected) => {
  if (selected) {
    _selectedRowKeys.value.push(record.id)
  } else {
    _selectedRowKeys.value = _selectedRowKeys.value.filter(el => el != record.id).map(el => el)
  }
}

const onSelectAll = (selected, selectedRows: Record<string, any>[], changeRows: any[]) => {
  if(selected) {
    _selectedRowKeys.value.push(...changeRows.map(item => item.id))
  } else {
    _selectedRowKeys.value = _selectedRowKeys.value.filter(el => {
      return !changeRows.find(item => el === item.id)
    }).map(el => el)
  }
}

const handleClick = (dt: any) => {
  if (isCheck.value) {
    if (_selectedRowKeys.value.includes(dt.id)) {
      const _index = _selectedRowKeys.value.findIndex((i) => i === dt.id)
      _selectedRowKeys.value.splice(_index, 1)
    } else {
      _selectedRowKeys.value = [..._selectedRowKeys.value, dt.id]
    }
  }
}

const valueFormat = (val: any) => {
  return props.dataColumns.find((item) => item.dataIndex === val)
}

const statusText = computed(() => {
  try {
    return (val: any) => {
      if(!val) {
        return '--'
      }
      if (typeof val === 'string') {
        return val
      } else if (typeof val === 'object') {
        return val?.text
      }
    }
  } catch (error) {
    return {}
  }
})

const dynamicIconUrl = computed(() => {
  return (val: string) => {
    let result = null
    try {
      result = JSON.parse(val || '{}')?.[0]?.url || null
    } catch (error) {
      result = null
    }
    return result
  }
})
const tableRef = ref()

const handleFunction = (item: any, data?: any) => {
  if (isFunction(item)) {
    return item(data)
  } else if (isObject(item)) {
    return item
  }
  return undefined
}

const tableDataChange = (pagination, filters, sorter) => {
  switch (sorter.order) {
    case 'ascend':
      defaultParams.sorts = [{ name: sorter.columnKey, order: 'asc' }]
      break
    case 'descend':
      defaultParams.sorts = [{ name: sorter.columnKey, order: 'desc' }]
      break
    default:
      defaultParams.sorts = [{ name: 'createTime', order: 'desc' }]
      break
  }
  tableRef.value.reload?.()
}
watchEffect(() => {
  props.tableActions.forEach((item) => {
    insertCustomCssToHead(item.style, item.key, 'dataid')
  })
  props.dataColumns.forEach((item) => {
    insertCustomCssToHead(
      item.config?.specialStyle,
      `${props.projectId}-${props.pageId}-${item.dataIndex}`,
      'dataid',
    )
  })
})

defineExpose({
  reload: () => {
    tableRef.value?.reload()
  },
  _selectedRowKeys,
})
</script>

<style scoped lang="less">
.image-icon {
  width: 14px;
  height: 14px;
  margin: 0;
}
:deep(.ant-avatar) {
  background-color: transparent !important;
}
.select-tag {
  margin-right: 5px;
  background-color: #f5f5f5;
  padding: 0 2px;
  border: 1px solid #f0f0f0;
}
</style>
