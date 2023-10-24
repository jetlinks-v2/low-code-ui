<template>
  <div class="container">
    <Canvas></Canvas>
  </div>
</template>

<script lang="ts" setup>
import Canvas from './components/Panels/Canvas/index'
import { provide, ref, reactive, PropType, watch } from 'vue'
import { ISchema } from './typings'
import { getFieldData, initData } from './utils/utils'
import { proAll } from '../QuickEditTable/util'
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  value: {
    // 表单初始值
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String as PropType<'add' | 'edit'>,
    default: 'add',
  },
  data: {
    type: Object,
    default: () => ({}),
  },
  type: {
    // 判断是工作流还是低代码
    type: String as PropType<'workflow' | 'low-code'>,
    default: 'low-code',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  formStyle: {
    type: Object,
  },
})

const emit = defineEmits(['valueChange', 'stateChange'])

const formData = ref<ISchema>(initData) // 表单数据
const formState = reactive({})
const formRef = ref<any>()
const refList = ref<any>({})
const formRefList = ref<any>({})

const onChange = () => {
  emit('stateChange', formState)
}

watch(
  () => [JSON.stringify(props.value), JSON.stringify(props.data)],
  () => {
    if (props.data) {
      let obj = cloneDeep(props.data)
      if (props.formStyle) {
        obj = {
          ...obj,
          componentProps: {
            ...obj.componentProps,
            ...props.formStyle,
          },
        }
      }
      formData.value = obj as ISchema
      Object.assign(formState, getFieldData(formData.value) || {})
    }
    Object.assign(formState, props.value || {})
  },
  {
    immediate: true,
  },
)

watch(
  () => props.formStyle,
  (val: any) => {
    if (val) {
      const obj = {
        ...formData.value,
        componentProps: {
          ...formData.value.componentProps,
          ...val,
        },
      }
      formData.value = cloneDeep(obj)
    }
  },
  {
    immediate: true,
  },
)

provide('FormDesigner', {
  model: 'preview',
  type: props?.type || 'low-code',
  refList,
  formRefList,
  formData,
  formState,
  formRef,
  mode: props.mode,
  disabled: props.disabled,
  onChange,
})

const onSave = () => {
  // 校验内嵌表单
  const _func = Object.keys(formRefList.value || {}).map((item) => {
    return formRefList.value[item]?.onSave()
  })
  // 主表单
  _func.push(formRef.value?.validate())
  return new Promise((resolve, reject) => {
    proAll(_func)
      .then(() => {
        //
        resolve(formState)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

watch(
  () => JSON.stringify(formData.value),
  () => {
    emit('valueChange', formData.value)
  },
)

defineExpose({ onSave, formState })
</script>

<style lang="less" scoped>
.container {
  background-color: #fff;
}
</style>
