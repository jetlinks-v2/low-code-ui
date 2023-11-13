<template>
  <div>
    <j-tree-select
      :tree-data="options"
      :value="__value"
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
import { getDepartmentList_api } from '@/api/user'
import { useRequest } from '@jetlinks/hooks'
import { map } from 'lodash-es'
import { ref, watch, computed, unref } from 'vue'

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

const _value = ref<any>()

const __value = computed(() => {
  if (props.mode !== 'multiple') {
    return _value?.value?.id
  } else {
    const _val = Array.isArray(props.value) ? props.value : []
    return map(_val, 'id')
  }
})

const getObj = (arr: any[], _item: string) => {
  for (let index = 0; index < arr?.length; index++) {
    const element = arr[index]
    if (element?.id === _item) {
      return element
    } else if (element?.children?.length) {
      const obj = getObj(element?.children, _item)
      if (obj) {
        return obj
      }
    }
  }
}

const _getObj = (value: any) => {
  const obj = {}
  props.keys.map((item: any) => {
    if (item?.key) {
      obj[item.key] = value?.[item?.key]
    }
  })
  return obj
}

const valueChange = (value: any) => {
  if (props.mode !== 'multiple') {
    emit('update:value', _getObj(getObj(unref(options), value)))
  } else {
    const arr = value.map((i) => {
      const a = getObj(unref(options), i)
      return _getObj(a)
    })
    emit('update:value', arr)
  }
  emit('change')
}

const dealTreeData = (tree: any[]) => {
  return tree.map((item: any) => {
    if (item?.children) {
      return {
        ...item,
        label: item?.name,
        value: item?.id,
        children: dealTreeData(item.children),
      }
    } else {
      return {
        ...item,
        label: item?.name,
        value: item?.id,
      }
    }
  })
}
const { data: options, run } = useRequest(getDepartmentList_api, {
  onSuccess(res) {
    return dealTreeData(res.result)
  },
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
      run()
    }
  },
  { deep: true, immediate: true },
)
</script>
<style lang="less" scoped>
</style>
