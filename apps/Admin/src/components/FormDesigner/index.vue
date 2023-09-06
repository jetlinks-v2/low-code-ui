<template>
  <div class="container">
    <Header @save="onSave" :data="data" />
    <div class="box">
      <div class="left"><Filed /></div>
      <div class="right">
        <Canvas :data="formData"></Canvas>
      </div>
      <div class="config" v-if="isShowConfig && model !== 'preview'">
        <Config ref="configRef" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from './components/Header/index.vue'
import Canvas from './components/Panels/Canvas/index'
import Config from './components/Panels/Config/index.vue'
import {
  provide,
  ref,
  reactive,
  watch,
  onUnmounted,
  unref
} from 'vue'
import Filed from './components/Panels/Filed/index.vue'
import { ISchema } from './typings'
import { omit } from 'lodash-es'
import { useProduct } from '@/store/product'
import { useMagicKeys } from '@vueuse/core'

const initData = {
  type: 'root',
  key: 'root',
  componentProps: {
    layout: 'horizontal',
    size: 'default',
    cssCode: '',
    eventCode: '',
  },
  children: [],
}

const props = defineProps({
  value: {
    type: Object,
    default: () => {},
  },
  mode: {
    // 是否为编辑
    type: String as PropType<'add' | 'edit' | undefined>,
    default: undefined,
  },
  data: {
    type: Object,
  },
})

const model = ref<'preview' | 'edit'>(props.mode ? 'preview' : 'edit') // 预览；编辑
const formData = ref<any>(initData) // 表单数据
const isShowConfig = ref<boolean>(false) // 是否展示配置
const selected = ref<any[]>([]) // 被选择数据,需要多选
const formState = reactive<any>({})
const errorKey = ref<string[]>([])
const formRef = ref<any>()
const configRef = ref<any>()
const refList = ref<any>({})

const {shift, space, ctrl, Delete} = useMagicKeys()

const collectVisible = ref<boolean>(false)
const collectData = ref<any[]>([])

const product = useProduct()

const onSaveData = () => {
  const obj = {
    ...props.data,
    configuration: {
      type: 'form',
      code: JSON.stringify(unref(formData)),
    },
  }
  // console.log('props.data',props.data)
  product.update(obj)
}

// 设置数据被选中
const setSelection = (node: any) => {
  if (['card-item', 'grid-item'].includes(node.type)) return
  if (shift.value || ctrl.value) {
    if (node === 'root') return
    selected.value.push(node)
  } else {
    selected.value = []
    if (node === 'root') {
      selected.value.push(formData.value)
    } else {
      selected.value.push(node)
    }
  }
  isShowConfig.value = !(selected.value?.length > 1)
  onSaveData()
}

const setModel = (_type: 'preview' | 'edit') => {
  model.value = _type
}

const getFieldChildrenData = (data: ISchema[]) => {
  let obj: any = {}
  data.map((item: any) => {
    obj = {
      ...obj,
      ...getFieldData(item),
    }
  })
  return obj
}

const getFieldData = (data: ISchema) => {
  let obj: any = undefined
  if (data.children && data.children?.length) {
    obj = getFieldChildrenData(data?.children)
  }
  let _obj: any = {}
  if (data?.formItemProps?.name) {
    if (data.type === 'table') {
      _obj[data?.formItemProps?.name] = [omit(obj, ['actions', 'index'])]
    } else {
      _obj[data?.formItemProps?.name] = obj
    }
  } else {
    _obj = obj
  }
  return _obj
}

provide('FormDesigner', {
  tabsId: props.data?.id,
  model,
  formData,
  isShowConfig,
  selected,
  formState,
  formRef,
  errorKey,
  mode: props?.mode,
  refList,
  collectVisible,
  collectData,
  setSelection,
  setModel,
  onSaveData,
})

const onSave = () => {
  if (model.value !== 'edit') {
    formRef?.value
      .validateFields()
      .then((values) => {
        console.log('Received values of form: ', values)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }
}

watch(
  () => model.value,
  (newValue: 'preview' | 'edit') => {
    if (newValue === 'preview') {
      Object.assign(formState, {})
      const obj: any = getFieldData(formData.value)
      Object.assign(formState, obj)
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

watch(
  () => props.data,
  (newVal) => {
    try {
      formData.value = JSON.parse(newVal?.configuration?.code) || initData
    } catch (error) {}
  },
  {
    deep: true,
    immediate: true,
  },
)

onUnmounted(() => {
  onSaveData()
})

defineExpose({ onSave })
</script>

<style lang="less" scoped>
.container {
  background-color: #fff;
  height: calc(100vh - 125px);
  .box {
    display: flex;
    width: 100%;
    height: calc(100% - 50px);

    .left {
      width: 300px;
      height: 100%;
    }

    .right {
      flex: 1;
    }

    .config {
      width: 300px;
    }
  }
}
</style>

