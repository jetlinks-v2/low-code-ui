<template>
  <div
    class="condition-select"
    v-for="(item, index) in conditionSelect"
    :key="index"
  >
    <j-tree-select
      v-model:value="item.column"
      v-model:searchValue="item.searchValue"
      show-search
      placeholder="请选择"
      allow-clear
      tree-default-expand-all
      tree-node-filter-prop="name"
      :tree-data="conditionOptions"
      :field-names="{ label: 'name', value: 'fullId' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      style="width: 400px"
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
      v-model:value="item.termsType"
      :options="termsOptions"
      placeholder="请选择"
      style="width: 90px"
    />
    <ConditionValueItem
      v-model:modelValue="item.value"
      :itemType="getComponentsType(item)"
    />

    <AIcon
      type="DeleteOutlined"
      style="color: red"
      @click="handleRemove(index)"
      v-if="index !== 0"
    />
  </div>
  <j-button type="primary" block size="small" ghost @click="handleAdd">
    +
  </j-button>
</template>

<script setup lang="ts">
import { queryVariables_api } from '@/api/process/model'
import { useFlowStore } from '@/store/flow'
import { findVariableById } from './utils'
import ConditionValueItem from './ConditionValueItem.vue'

const flowStore = useFlowStore()

interface IConditionSelect {
  column: string | undefined
  termsType: string | undefined
  value: string | string[] | number | undefined
  searchValue: string | undefined
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
              termsType: undefined,
              value: undefined,
              searchValue: '',
            },
          ]
  },
  { deep: true, immediate: true },
)
// const conditionSelect = computed({
//   get: () => props.value,
//   set: (val) => {
//     console.log('conditionSelect.value1: ', val)
//     emit('update:value', val)
//   },
// })

const conditionOptions = ref([])

const termsOptions = ref([
  {
    label: '=',
    value: 'eq',
  },
  {
    label: '!=',
    value: 'not',
  },
  {
    label: '包含',
    value: 'in',
  },
  {
    label: '不包含',
    value: 'nin',
  },
])

/**
 * 变量列表的others.type = 组织org、用户user、角色role、产品product、设备device时,
 * 取下拉值为下拉单选/多选框, 否则为输入框
 */
const getComponentsType = (item) => {
  const _var = findVariableById(conditionOptions.value, item.column)
  console.log('_var?.others?.type: ', _var?.others?.type)
  return _var?.others?.type
}

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
      model,
      provider,
    },
    nodeId: flowStore.selectedNode.props.branchBy, // 条件节点配置, id传当前条件节点的branchBy
  }
  const { result } = await queryVariables_api(params)
  conditionOptions.value = result
}

const handleRemove = (index: number) => {
  conditionSelect.value.splice(index, 1)
}

const handleAdd = () => {
  conditionSelect.value.push({
    column: undefined,
    termsType: undefined,
    value: undefined,
    searchValue: '',
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
