<template>
  <j-tree-select
    :tree-data="data"
    :value="_value"
    @change="valueChange"
    :multiple="mode === 'multiple'"
    :disabled="disabled"
    placeholder="请选择"
   :size="size"
   style="min-width: 230px;"
  >
  </j-tree-select>
</template>

<script lang="ts" setup>
import { getDepartmentList_api } from '@/api/user'
import { useRequest } from '@jetlinks/hooks'
import { ref, watch } from 'vue'
const props = defineProps({
  value: {
    type: Array,
    default: [],
  },
  mode: {
    type: String,
    default: '',
  },
  model: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:value'])

const _value = ref()

const valueChange = (value: any) => {
  emit('update:value', value)
}
const dealTreeData = (tree: any) => {
  return tree.map((item: any) => {
    if (item?.children) {
      return {
        label: item?.name,
        value: item?.id,
        children: dealTreeData(item.children),
      }
    } else {
      return {
        label: item?.name,
        value: item?.id,
      }
    }
  })
}
const { data, run } = useRequest(getDepartmentList_api, {
  onSuccess(res) {
    return dealTreeData(res.result)
  },
})

watch(
  () => props.value,
  () => {
    _value.value = props.value
  },
  { deep: true, immediate: true },
)

watch(
  () => props.model,
  (newVal) => {
    if (newVal !== 'edit') {
      run()
    }
  },
  { deep: true, immediate: true },
)
</script>
<style lang="less" scoped>
</style>