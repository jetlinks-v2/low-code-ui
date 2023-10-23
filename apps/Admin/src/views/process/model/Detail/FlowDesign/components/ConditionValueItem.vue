<template>
  <j-select
    v-if="normalSelectTypes.includes(conditionType)"
    v-model:value="myValue"
    :options="valueOptions"
    @change="onChange"
  />
  <j-tree-select
    v-else-if="conditionType === 'org'"
    v-model:value="myValue"
    v-model:searchValue="searchValue"
    show-search
    placeholder="请选择"
    allow-clear
    tree-default-expand-all
    tree-node-filter-prop="name"
    :tree-data="orgOptions"
    :field-names="{ label: 'name', value: 'id' }"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    @change="onChange"
  >
    <!-- :multiple="['eq', 'not'].includes(item.termsType as string) ? false : true" -->
    <template #title="{ name }">
      <template
        v-for="(fragment, i) in name
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
    v-else-if="conditionType === 'date'"
    :valueFormat="'YYYY-MM-DD HH:mm:ss'"
    v-model:value="myValue"
    allowClear
    showTime
    @change="onChange"
  />
  <j-input
    v-else
    v-model:value="myValue"
    @change="onChange"
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
} from '@/api/process/model'
type Emits = {
  (e: 'update:modelValue', data: string | number | boolean): void
}
type Props = {
  modelValue: string | string[] | number | undefined
  conditionType: string
  mode?: string
}
const emit = defineEmits<Emits>()
const props = defineProps<Props>()

const myValue = ref<any>(undefined)
const searchValue = ref<string>('')

// 普通下拉的类型
const normalSelectTypes = ['role', 'user', 'product', 'device', 'switch']
// 用户/角色/产品/设备 普通下拉数据
const valueOptions = ref<{ label: string; value: string }[]>([])
// 组织下拉树形数据
const orgOptions = ref([])
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
  const { result } = await getRole_api(publicParams)
  valueOptions.value = result?.map((m) => ({
    label: m.name,
    value: m.id,
  }))
}

const getOrgOptions = async () => {
  const { result } = await getOrg_api(publicParams)
  orgOptions.value = result
}

const getUserOptions = async () => {
  const { result } = await getUser_api(publicParams)
  valueOptions.value = result?.map((m) => ({
    label: m.name,
    value: m.id,
  }))
}

const getProductOptions = async () => {
  const { result } = await getProduct_api(publicParams)
  valueOptions.value = result?.map((m) => ({
    label: m.name,
    value: m.id,
  }))
}

const getDeviceOptions = async () => {
  const { result } = await getDevice_api(publicParams)
  valueOptions.value = result?.map((m) => ({
    label: m.name,
    value: m.id,
  }))
}

const onChange = (e) => {
  emit('update:modelValue', myValue.value)
}

watch(
  () => props.modelValue,
  () => {
    myValue.value = props.modelValue
  },
  { deep: true, immediate: true },
)
watch(
  () => props.conditionType,
  (val) => {
    switch (val) {
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
      default:
        break
    }
  },
  { deep: true, immediate: true },
)
</script>

<style lang="less" scoped></style>
