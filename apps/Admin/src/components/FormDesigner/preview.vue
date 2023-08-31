<template>
  <div class="container">
    <Canvas :data="formData" ref="formRef"></Canvas>
  </div>
</template>
  
  <script lang="ts" setup>
import Canvas from './components/Panels/Canvas/index'
import { provide, ref, reactive, PropType, watch } from 'vue'
import { ISchema } from './typings'

const initData = {
  type: 'root',
  key: 'root',
  componentProps: {
    layout: 'horizontal',
    size: 'default',
  },
  children: [
    {
      type: 'input',
      key: '123',
      name: '123',
      formItemProps: {
        label: '123',
      },
    },
  ],
}

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
    type: Object
  },
})
const formData = ref<ISchema>() // 表单数据
const formState = reactive<any>({})
const formRef = ref<any>()

watch(
  () => props.data?.other?.formDesigner,
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
  mode: props.mode
})

const onSave = () => {
  formRef.value
    .validateFields()
    .then((values) => {
      console.log('Received values of form: ', values)
    })
    .catch((info) => {
      console.log('Validate Failed:', info)
    })
}

defineExpose({ onSave })
</script>
  
  <style lang="less" scoped>
.container {
  background-color: #fff;
}
</style>