<template>
  <div class="container">
    <Header @save="onSave" />
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
import Filed from './components/Panels/Filed/index.vue'
import { provide, ref, reactive, watch} from 'vue'
import { ISchema } from './typings'
// import { updateData } from './utils/utils'

const initData = {
  type: 'root',
  key: 'root',
  componentProps: {
    layout: 'horizontal',
    size: 'default',
  },
  children: [],
}

const props = defineProps({
  // inlineMax: { // inline横排最多展示的组件个数
  //   type: Number,
  //   default: 4,
  // },
  // fileUploadURI: { // 上传组件的action
  //   type: String,
  // },
  value: {
    type: Object,
    default: () => {},
  },
})

const model = ref<'preview' | 'edit'>('edit') // 预览；编辑
const formData = ref<ISchema>(initData) // 表单数据
const isShowConfig = ref<boolean>(false) // 是否展示配置
const selected = reactive<any>({}) // 被选择数据
const formState = reactive<any>({})
const errorKey = ref<string[]>([])
const formRef = ref<any>()
const configRef = ref<any>()

// 设置数据被选中
const setSelection = (node: any) => {
  let result: any = {}
  if (node === 'root') {
    result = formData.value
  } else {
    if (Array.isArray(node)) {
      result = node?.[0]
    } else {
      result = node
    }
  }
  Object.assign(selected, result)
  isShowConfig.value = selected?.key === result?.key
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
    if(data.type === 'table') {
      _obj[data?.formItemProps?.name] = [obj]
    } else {
      _obj[data?.formItemProps?.name] = obj
    }
  } else {
    _obj = obj
  }
  console.log(obj)
  return _obj
}

provide('FormDesigner', {
  model,
  formData,
  isShowConfig,
  selected,
  formState,
  formRef,
  errorKey,
  setSelection,
  setModel
})

const onSave = () => {
  if (model.value !== 'edit') {
    formRef?.value
      .validateFields()
      .then((values) => {
        console.log('Received values of form: ', values)
        // console.log('formState: ', toRaw(formState))
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
      const obj: any = getFieldData(formData.value)
      Object.assign(formState, {})
      Object.assign(formState, obj)
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

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