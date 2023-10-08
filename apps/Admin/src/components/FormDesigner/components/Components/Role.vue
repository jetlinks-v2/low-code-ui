<template>
  <div>
    <j-tree-select
      :tree-data="options"
      :value="_value"
      @change="valueChange"
      :multiple="mode === 'multiple'"
      :disabled="disabled"
      placeholder="请选择"
      :size="size"
      style="min-width: 230px"
    >
    </j-tree-select>
  </div>
</template>

<script lang="ts" setup>
import { getRoleList } from '@/api/form'
import { useRequest } from '@jetlinks/hooks'
import { ref, watch } from 'vue'
const props = defineProps({
  value: {
    type: [Array, String],
    // default: [],
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
    return {
      label: item.groupName,
      value: item.groupId,
      disabled: true,
      children: (item?.roles || [])?.map((i: any) => {
        return {
          label: i.name,
          value: i.id,
        }
      }),
    }
  })
}
const { data: options, run } = useRequest(getRoleList, {
  onSuccess(res) {
    const arr = dealTreeData(res.result)
    console.log(arr)
    return arr
  },
  immediate: false,
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
      run({
        sorts: [
          {
            name: 'createTime',
            order: 'desc',
          },
        ],
      })
    }
  },
  { deep: true, immediate: true },
)
</script>
<style lang="less" scoped>
</style>