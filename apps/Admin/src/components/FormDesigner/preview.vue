<template>
  <div class="container">
    <Canvas></Canvas>
  </div>
</template>
  
<script lang="ts" setup>
import Canvas from './components/Panels/Canvas/index'
import { provide, ref, reactive, PropType, watch, unref } from 'vue'
import { ISchema } from './typings'
import { getFieldData, initData } from './utils/utils'

const props = defineProps({
  value: {
    // 表单初始值
    type: Object,
    default: () => {},
  },
  mode: {
    type: String as PropType<'add' | 'edit'>,
    default: 'add',
  },
  data: {
    type: Object,
  },
})

const emit = defineEmits(['valueChange', 'stateChange'])

const formData = ref<ISchema>(initData) // 表单数据
const formState = reactive<any>({})
const formRef = ref<any>()

watch(
  () => props.data,
  (newVal) => {
    formData.value = (newVal || initData) as ISchema
  },
  {
    deep: true,
    immediate: true,
  },
)

watch(
  () => props.value,
  () => {
    console.log(getFieldData(formData.value))
    console.log(props.value)
    Object.assign(formState, props.value)
  },
  {
    deep: true,
    immediate: true,
  },
)

provide('FormDesigner', {
  model: 'preview',
  formData,
  formState,
  formRef,
  mode: props.mode,
})

const onSave = () => {
  return new Promise((resolve, inject) => {
    formRef.value
      .validate()
      .then((_data: any) => {
        resolve({ ...unref(formState), ..._data })
      })
      .catch((err: any) => {
        inject(err)
      })
  })
}

watch(
  () => JSON.stringify(formData.value),
  () => {
    emit('valueChange', formData.value)
  },
)

watch(
  () => formState,
  (newVal) => {
    emit('stateChange', newVal)
  },
  {
    deep: true,
  },
)

defineExpose({ onSave })
</script>
  
<style lang="less" scoped>
.container {
  background-color: #fff;
}
</style>
