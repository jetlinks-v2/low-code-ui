<template>
  <div class="container">
    <Canvas></Canvas>
  </div>
</template>
  
<script lang="ts" setup>
import Canvas from './components/Panels/Canvas/index'
import { provide, ref, reactive, PropType, watch } from 'vue'
import { ISchema } from './typings'
import { initData } from './utils/utils'

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

const emit = defineEmits(['valueChange', 'change'])

const formData = ref<ISchema>() // 表单数据
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
        resolve(_data)
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

const stop = watch(
  formState,
  () => {
    emit('change', formState)
    stop()
  }
)

defineExpose({ onSave, formState})
</script>
  
<style lang="less" scoped>
.container {
  background-color: #fff;
}
</style>
