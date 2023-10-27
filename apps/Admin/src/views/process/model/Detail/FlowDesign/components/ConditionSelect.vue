<template>
  <div v-for="(item, index) in conditionSelect" :key="index">
    <j-select
      v-if="index > 0"
      v-model:value="item.type"
      :options="[
        { label: '或者', value: 'or' },
        { label: '并且', value: 'and' },
      ]"
      placeholder="请选择"
      style="width: 90px; margin-bottom: 10px"
    />
    <div class="condition-select">
      <j-tree-select
        v-model:value="item.selectedColumn"
        v-model:searchValue="item.searchValue"
        show-search
        label-in-value
        placeholder="请选择"
        allow-clear
        tree-default-expand-all
        tree-node-filter-prop="name"
        :tree-data="conditionOptions"
        :field-names="{ label: 'name', value: 'fullId' }"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        style="width: 400px"
        @change="handleConditionChange(item)"
      >
        <template #title="{ name }">
          <template
            v-for="(fragment, i) in name
              ?.toString()
              ?.split(
                new RegExp(
                  `(?<=${item.searchValue})|(?=${item.searchValue})`,
                  'i',
                ),
              )"
          >
            <span
              v-if="fragment.toLowerCase() === item.searchValue?.toLowerCase()"
              :key="i"
              style="color: #08c"
            >
              {{ fragment }}
            </span>
            <template v-else>{{ fragment }}</template>
          </template>
        </template>
      </j-tree-select>
      <j-select
        v-model:value="item.selectedTermType"
        :options="operatorMap[conditionType(item) || 'default']"
        label-in-value
        placeholder="请选择"
        style="width: 90px"
        @change="handleTermTypeChange(item)"
      />
      <ConditionValueItem
        v-model:modelValue="item.value"
        :conditionType="conditionType(item)"
      />

      <AIcon
        type="DeleteOutlined"
        style="color: red"
        @click="handleRemove(index)"
        v-if="index !== 0"
      />
    </div>
  </div>
  <j-button type="primary" block size="small" ghost @click="handleAdd">
    +
  </j-button>
</template>

<script setup lang="ts">
import { queryVariables_api } from '@/api/process/model'
import { useFlowStore } from '@/store/flow'
import ConditionValueItem from './ConditionValueItem.vue'
import { operatorMap } from './const'
import { findVariableById } from './utils'

const flowStore = useFlowStore()

interface IConditionSelect {
  column: string | undefined
  termType: string | undefined
  value: string | string[] | number | undefined
  searchValue: string | undefined
  type?: string

  selectedColumn?: any // 下拉条件树选中的值, 设置了label-in-value, 选中的值为object
  columnName?: string | undefined
  selectedTermType?: any
  termTypeName?: string | undefined
  valueName?: string | undefined
}

const emit = defineEmits(['update:value'])
const props = defineProps({
  value: {
    type: Array as PropType<IConditionSelect[]>,
    default: () => [],
  },
})

const conditionSelect = ref<IConditionSelect[]>([])
watch(
  () => props.value,
  (val) => {
    conditionSelect.value =
      val && val.length
        ? val
        : [
            {
              column: undefined,
              termType: undefined,
              value: undefined,

              // 前端筛选需要
              searchValue: '',
              // 存起来, 节点回显需要
              columnName: undefined,
              termTypeName: undefined,
              valueName: undefined,
            },
          ]
  },
  { deep: true, immediate: true },
)

const conditionOptions = ref([])

/**
 * 获取条件下拉数据
 */
const getFormFields = async () => {
  const { id, name, key, model, provider } = flowStore.modelBaseInfo
  const params = {
    definition: {
      id,
      name,
      key,
      model: JSON.stringify(flowStore.model), // model不能取modelBaseInfo(接口保存才会有值), 直接取动态值flowStore.model
      provider,
    },
    nodeId: flowStore.selectedNode.props.branchBy, // 条件节点配置, id传当前条件节点的branchBy
  }
  const { result } = await queryVariables_api(params)
  conditionOptions.value = result
}

/**
 * 条件选择改变 设置column和columnName
 * @param item
 */
const handleConditionChange = (item) => {
  item.column = item.selectedColumn.value
  item.columnName = item.selectedColumn.label
}

const handleTermTypeChange = (item) => {
  item.termType = item.selectedTermType.value
  item.termTypeName = item.selectedTermType.label
}

/**
 * 所选条件(变量/表单字段)类型
 * 变量列表的others.type = 组织org、用户user、角色role、产品product、设备device时,
 * 取下拉值为下拉单选/多选框, 否则为输入框
 */
const conditionType = (item) => {
  const _var = findVariableById(conditionOptions.value, item?.column)
  //   console.log('_var: ', _var)
  return _var?.others?.type
}

const handleRemove = (index: number) => {
  conditionSelect.value.splice(index, 1)
}

const handleAdd = () => {
  conditionSelect.value.push({
    column: undefined,
    termType: undefined,
    value: undefined,
    type: undefined,

    // 前端筛选需要
    searchValue: '',
    // 存起来, 节点回显需要
    columnName: undefined,
    termTypeName: undefined,
    valueName: undefined,
  })
}

watch(
  () => conditionSelect.value,
  (val) => {
    // console.log('conditionSelect: ', val)
    emit('update:value', val)
  },
  { deep: true },
)

onMounted(() => {
  getFormFields()
})
</script>

<style lang="less" scoped>
.condition-select {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
</style>
