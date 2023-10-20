<template>
  <j-tree-select
    v-if="itemType === 'org'"
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
  itemType: string
  mode?: string
}
const emit = defineEmits<Emits>()
const props = defineProps<Props>()

const myValue = ref<any>(undefined)
const searchValue = ref<string>('')

const roleOptions = ref([])
const orgOptions = ref([])
const userOptions = ref([])
const productOptions = ref([])
const deviceOptions = ref([])
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
const getOrgOptions = async () => {
  const { result } = await getOrg_api(publicParams)
  console.log('getOrgOptions: ', result)
}
getOrgOptions()
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
</script>

<style lang="less" scoped></style>
