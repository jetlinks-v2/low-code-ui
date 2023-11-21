<template>
  <j-select
    v-if="normalSelectTypes.includes(conditionType)"
    v-model:value="myValue"
    :options="valueOptions"
    :mode="['in', 'nin'].includes(operator?.value) ? 'multiple' : 'default'"
    show-search
    allow-clear
    placeholder="请选择"
    class="value-select"
    :field-names="sourceMap"
    :optionFilterProp="sourceMap.label"
    :max-tag-text-length="myValue?.length > 1 ? 1 : 6"
    :max-tag-count="1"
    @change="onChange"
  />
  <j-tree-select
    v-else-if="['org', 'tree-select'].includes(conditionType)"
    v-model:value="myValue"
    v-model:searchValue="searchValue"
    :multiple="['in', 'nin'].includes(operator?.value)"
    :max-tag-text-length="myValue?.length > 1 ? 1 : 6"
    :max-tag-count="1"
    class="value-select"
    show-search
    placeholder="请选择"
    allow-clear
    tree-default-expand-all
    :tree-node-filter-prop="sourceMap.label"
    :tree-data="valueOptions"
    :field-names="sourceMap"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    @change="onChange"
  >
    <!-- :multiple="['eq', 'not'].includes(item.termsType as string) ? false : true" -->
    <template #title="data">
      <template
        v-for="(fragment, i) in data[sourceMap.label]
          ?.toString()
          ?.split(new RegExp(`(?<=${searchValue})|(?=${searchValue})`, 'i'))"
      >
        <span
          v-if="fragment.toLowerCase() === searchValue?.toLowerCase()"
          :key="i"
          style="color: #08c"
        >
          {{ fragment }}
        </span>
        <template v-else>{{ fragment }}</template>
      </template>
    </template>
  </j-tree-select>
  <j-date-picker
    v-else-if="['date', 'date-picker'].includes(conditionType)"
    :valueFormat="'YYYY-MM-DD HH:mm:ss'"
    v-model:value="myValue"
    class="value-select"
    allowClear
    showTime
    @change="onChange"
  />
  <j-time-picker
    v-else-if="conditionType === 'time-picker'"
    v-model:value="myValue"
    valueFormat="HH:mm:ss"
    class="value-select"
    allowClear
    showTime
    @change="onChange"
  />
  <j-input-number
    v-else-if="conditionType === 'input-number'"
    v-model:value="myValue"
    class="value-select"
    @change="onChange"
    placeholder="请输入"
  />
  <j-input
    v-else
    v-model:value="myValue"
    class="value-select"
    @change="onChange"
    maxlength="64"
    placeholder="请输入"
  />
</template>

<script setup lang="ts">
import {
  getRole_api,
  getOrg_api,
  getUser_api,
  getProduct_api,
  getDevice_api,
  queryFormNoPage_api
} from '@/api/process/model'
import { queryRuntime, queryDictionaryData } from '@/api/form'
import { useFlowStore } from '@/store/flow'
import { dictionaryItemList } from '@/api/list'
import {isBoolean} from "lodash-es";
type Emits = {
  (e: 'update:modelValue', data: string | number | boolean): void
  (e: 'update:selectedItem', data?: string[]): void
}
type Props = {
  modelValue: string | string[] | number | undefined
  conditionType: string
  mode?: string
  fullId?: string
  operator?: Record<string, any>,
  formItemComponent?: string
}

const flowStore = useFlowStore()
const emit = defineEmits<Emits>()
const props = defineProps<Props>()

const myValue = ref<any>(undefined)
const searchValue = ref<string>('')

// 普通下拉的类型
const normalSelectTypes = ['role', 'user', 'product', 'device', 'switch', 'select', 'select-card']
// 用户/角色/产品/设备 普通下拉数据
const valueOptions = ref<{ label: string; value: string }[]>([])
// 组织下拉树形数据
const publicParams = {
  paging: false,
  sorts: [
    {
      name: 'createTime',
      order: 'desc',
    },
  ],
  terms: [],
}
const getRoleOptions = async () => {
  valueOptions.value = [];
  sourceMap.label = 'name'
  sourceMap.value = 'id'
  const { result } = await getRole_api(publicParams)
  valueOptions.value = result
}

const getOrgOptions = async () => {
  valueOptions.value = [];
  sourceMap.label = 'name'
  sourceMap.value = 'id'
  const { result } = await getOrg_api(publicParams)
  valueOptions.value = result
}

const getUserOptions = async () => {
  valueOptions.value = [];
  sourceMap.label = 'name'
  sourceMap.value = 'id'
  const { result } = await getUser_api(publicParams)
  valueOptions.value = result
}

const getProductOptions = async () => {
  valueOptions.value = [];
  sourceMap.label = 'name'
  sourceMap.value = 'id'
  const { result } = await getProduct_api(publicParams)
  valueOptions.value = result
}

const getDeviceOptions = async () => {
  valueOptions.value = []
  sourceMap.label = 'name'
  sourceMap.value = 'id'
  const { result } = await getDevice_api(publicParams)
  valueOptions.value = result
}

const formatText = (label) => {
  if(Array.isArray(label)) {
    return label.map(item => item[sourceMap.label] || item)
  } else if(label[sourceMap.label]) {
    return [label[sourceMap.label]]
  }
}
const onChange = (e, label) => {
  let _value = myValue.value
  if (props.conditionType === 'switch') {
    if (myValue.value === 'true') {
      _value = true
    } else if (myValue.value === 'false'){
      _value = false
    } else {
      _value = undefined
    }
  }
  emit('update:modelValue', _value)
  if(label) {
    emit('update:selectedItem', formatText(label))
  } else {
    emit('update:selectedItem', undefined)
  }
}

const sourceMap = reactive({
  label: 'label',
  value: 'value'
})
/**类型是表单里的下拉框时 */
const findValueOptions = async () => {
  valueOptions.value = [];
  const existForms = flowStore.model.config.forms?.filter((f) => !f.isDelete)
  // 查询预览表单参数
  const params = {
    paging: false,
    terms: [
      {
        column: 'key',
        termType: 'in',
        value: existForms?.map((m) => m.formId),
      },
      {
        column: 'latest',
        termType: 'eq',
        value: 'true',
      },
    ],
  }
  const {result} = await queryFormNoPage_api(params)
  const source = searchTree(result?.[0].configuration.children, props.formItemComponent)?.componentProps?.source
  if(source?.type === 'end') {
    sourceMap.label = source.label;
    sourceMap.value = source.value
    const { result } = await queryRuntime(source.projectId, source.fullId, source.commandId, {})
    valueOptions.value = result.isSource ? result?.[source.source] : result
  } else if(source?.type === 'dic') {
    sourceMap.label = 'text';
    sourceMap.value = 'value'
    const { result } = await dictionaryItemList(source.dictionary)
    valueOptions.value = result
  }
}

watch(
  () => [props.modelValue, props.conditionType],
  () => {
    if (props.conditionType === 'switch') {
      myValue.value = isBoolean(props.modelValue) ? String(props.modelValue) : props.modelValue
    } else {
      myValue.value = props.modelValue
    }

  },
  { deep: true, immediate: true },
)
watch(
  () => [props.conditionType, props.fullId],
  (val) => {
    switch (val[0]) {
      case 'role':
        getRoleOptions()
        break
      case 'org':
        getOrgOptions()
        break
      case 'user':
        getUserOptions()
        break
      case 'product':
        getProductOptions()
        break
      case 'device':
        getDeviceOptions()
        break
      case 'switch':
        sourceMap.label = 'label'
        sourceMap.value = 'value'
        valueOptions.value = [
          {
            label: '是',
            value: 'true',
          },
          {
            label: '否',
            value: 'false',
          },
        ]
        break
      case 'select':
        // 过滤已经删除的表单
        findValueOptions()
        break
      case 'select-card':
        // 过滤已经删除的表单
        findValueOptions()
        break
      case 'tree-select':
        // 过滤已经删除的表单
        findValueOptions()
        break
      default:
        break
    }
  },
  { deep: true, immediate: true },
)

const searchTree = (arr: any[], _item: any) => {
    let _data: any = undefined
    for(let i = 0; i < arr.length; i++) {
      if (arr[i].key === _item) {
            _data = arr[i]
            break
        }
        if (arr[i].children?.length && !_data) {
          _data = searchTree(arr[i].children, _item)
        }
    }
    return _data
}

watch(() => props.operator?.value, (newVal, oldVal) => {
  if(['in', 'nin'].includes(newVal) && ['eq', 'neq'].includes(oldVal)) {
    myValue.value = []
  } else if(['eq', 'neq'].includes(newVal) && ['in', 'nin'].includes(oldVal)) {
    myValue.value = undefined
  }
})
</script>

<style lang="less" scoped>
.value-select{
  max-width: 170px;
  min-width: 170px;
  border: 1px solid #CE29DD;
  color: #CE29DD;
  :deep(.ant-select-selector) {
    background-color: #FEF5FF;
  }
  :deep(.ant-select-arrow) {
    color: #CE29DD;
  }
  :deep(.ant-select-clear) {
    color: #CE29DD;
  }
  :deep(.ant-select-selection-placeholder) {
    color: #CE29DD;
  }
}
input{
  color: #CE29DD !important;
  background-color: #FEF5FF;
  &::placeholder{
    color: #CE29DD !important;
  }
}
</style>
