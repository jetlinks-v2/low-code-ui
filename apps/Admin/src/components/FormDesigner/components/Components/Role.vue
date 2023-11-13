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
      style="width: 100%"
    >
    </j-tree-select>
  </div>
</template>

<script lang="ts" setup>
import { getRoleList } from '@/api/form'
import { useRequest } from '@jetlinks/hooks'
import { map } from 'lodash-es'
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
  keys: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['update:value','change'])
const _value = ref()

const _getObj = (value: any) => {
  const obj = {}
  props.keys.map((item: any) => {
    if (item?.key) {
      obj[item.key] = value?.[item?.key]
    }
  })
  return obj
}

const getObj = (arr: any[], _item: string) => {
  for (let index = 0; index < arr?.length; index++) {
    const element = arr[index]
    if (element?.value === _item) {
      return element
    } else if (element?.children?.length) {
      const obj = getObj(element?.children, _item)
      if (obj) {
        return obj
      }
    }
  }
}

const valueChange = (value: any) => {
  if (props.mode !== 'multiple') {
    emit('update:value', _getObj(getObj(options.value, value)))
  } else {
    const arr = value.map((i) => {
      return _getObj(getObj(options.value, i))
    })
    emit('update:value', arr)
  }
  emit('change')
}

const dealTreeData = (tree: any) => {
  return tree.map((item: any) => {
    return {
      label: item.groupName,
      value: item.groupId,
      disabled: true,
      children: (item?.roles || [])?.map((i: any) => {
        return {
          ...i,
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
    return arr
  },
  immediate: false,
})

watch(
  () => props.value,
  () => {
    if (props.mode !== 'multiple') {
      _value.value = Array.isArray(props?.value)
        ? props.value?.[0]?.id
        : props.value?.id
    } else {
      _value.value = Array.isArray(props?.value) ? map(props?.value, 'id') : []
    }
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
