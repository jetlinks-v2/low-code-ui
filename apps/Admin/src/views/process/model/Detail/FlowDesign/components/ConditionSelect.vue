<template>
  <div
    class="condition-select"
    v-for="(item, index) in conditionSelect"
    :key="index"
  >
    <j-tree-select
      v-model:value="item.condition"
      v-model:searchValue="item.searchValue"
      show-search
      placeholder="请选择"
      allow-clear
      tree-default-expand-all
      tree-node-filter-prop="label"
      :tree-data="conditionOptions"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    >
      <template #title="{ value: val, label }">
        <template
          v-for="(fragment, i) in label
            ?.toString()
            ?.split(
              new RegExp(
                `(?<=${item.searchValue})|(?=${item.searchValue})`,
                'i',
              ),
            )"
        >
          <span
            v-if="fragment.toLowerCase() === item.searchValue.toLowerCase()"
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
    />

    <j-select
      v-model:value="item.result"
      :options="valueOptions"
      placeholder="请选择"
      :mode="['eq', 'neq'].includes(item.termsType) ? 'combobox' : 'multiple'"
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
interface IConditionSelect {
  condition: string
  termsType: string
  result: string | string[]
  searchValue: string
}

const emit = defineEmits(['update:value'])
const props = defineProps({
  value: {
    type: Array as PropType<IConditionSelect[]>,
    default: () => [
      {
        condition: undefined,
        termsType: undefined,
        result: undefined,
        searchValue: '',
      },
    ],
  },
})

const conditionSelect = ref<IConditionSelect[]>([])
watch(
  () => props.value,
  (val) => {
    conditionSelect.value = val
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

const conditionOptions = ref([
  {
    label: '审批节点',
    value: 'node-0',
    children: [
      {
        label: '审批人',
        value: 'node-0-1',
      },
    ],
  },
  {
    label: '办理节点',
    value: 'node-1',
    children: [
      {
        label: '办理人',
        value: 'node-1-1',
      },
    ],
  },
  {
    label: '请假申请',
    value: 'node-2',
    children: [
      {
        label: '请假人',
        value: 'node-2-1',
      },
      {
        label: '请假时间',
        value: 'node-2-2',
      },
    ],
  },
])

const termsOptions = ref([
  {
    label: '=',
    value: 'eq',
  },
  {
    label: '!=',
    value: 'neq',
  },
  {
    label: '包含',
    value: 'include',
  },
  {
    label: '不包含',
    value: 'ninclude',
  },
])
const valueOptions = ref([
  {
    label: '表单提交人',
    value: 'id1',
  },
  {
    label: '节点审核人',
    value: 'id2',
  },
  {
    label: '节点办理人',
    value: 'id3',
  },
])

const handleRemove = (index: number) => {
  conditionSelect.value.splice(index, 1)
}

const handleAdd = () => {
  conditionSelect.value.push({
    condition: undefined,
    termsType: undefined,
    result: undefined,
    searchValue: '',
  })
}

watch(
  () => conditionSelect.value,
  (val) => {
    emit('update:value', val)
  },
  { deep: true },
)
</script>

<style lang="less" scoped>
.condition-select {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
</style>
