<template>
  <j-spin :spinning="spinning">
    <div class="container">
      <Header @save="onSave" :data="data" @validate="onValidate" />
      <div class="box">
        <div class="left" v-if="model !== 'preview'"><Filed /></div>
        <div class="right">
          <Canvas :data="formData"></Canvas>
        </div>
        <div class="config" v-if="isShowConfig && model !== 'preview'">
          <Config ref="configRef" />
        </div>
      </div>
    </div>
    <div class="check" v-if="model === 'preview' && !mode">
      <div style="margin-bottom: 5px">
        <j-button
          v-if="!checkVisible"
          type="primary"
          @click="checkVisible = true"
          >数据校验</j-button
        >
        <j-space v-else>
          <j-button @click="checkVisible = false">取消</j-button>
          <j-button type="primary" @click="onInput('get')"
            >获取数据<j-tooltip title="将表单中填写的所有数据获取到代码框中">
              <AIcon type="QuestionCircleOutlined" /> </j-tooltip
          ></j-button>
          <j-button type="primary" @click="onInput('set')"
            >加载数据<j-tooltip title="将代码框输入的模拟数据显示到代码框中">
              <AIcon type="QuestionCircleOutlined" /> </j-tooltip
          ></j-button>
        </j-space>
      </div>
      <template v-if="checkVisible">
        <div>
          <j-monaco-editor v-model="editData" :language="'json'" />
        </div>
      </template>
    </div>
  </j-spin>
</template>

<script lang="ts" setup>
import Header from './components/Header/index.vue'
import Canvas from './components/Panels/Canvas/index'
import Config from './components/Panels/Config/index.vue'
import Filed from './components/Panels/Filed/index.vue'
import {
  provide,
  ref,
  reactive,
  watch,
  onUnmounted,
  unref,
  computed,
} from 'vue'
import { ISchema } from './typings'
import { omit, debounce } from 'lodash-es'
import { useProduct, useFormDesigner } from '@/store'
import { useMagicKeys } from '@vueuse/core'
import { Modal } from 'jetlinks-ui-components'
import { deleteDataByKey, copyDataByKey, checkedConfig } from './utils/utils'
import { resolve } from 'dns'

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

const keys = useMagicKeys()
const _shift = keys['Shift']
const _ctrl = keys['Ctrl']

const collectVisible = ref<boolean>(false)
const collectData = ref<any[]>([])
const delVisible = ref<boolean>(false)
const spinning = ref<boolean>(false)
const checkVisible = ref<boolean>(false)
const editData = ref<string>()

const product = useProduct()
const formDesigner = useFormDesigner()

const isSelectedRoot = computed(() => {
  return !!selected.value.find((item) => item.key === 'root')
})

// 设置数据被选中
const setSelection = (node: any) => {
  if (['card-item'].includes(node.type)) return
  if (_shift.value || _ctrl.value) {
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

// 删除
const onDelete = debounce(() => {
  const arr = selected.value || []
  if (unref(isSelectedRoot) || !arr?.length) return
  delVisible.value = true
  Modal.confirm({
    title: '确定删除组件及其配置？',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      delVisible.value = false
      // 删除数据
      const _data: any = selected.value
        .map((item) => {
          return deleteDataByKey(formData.value.children, item)
        })
        .pop()
      formData.value = {
        ...formData.value,
        children: _data?.arr || [],
      }
      setSelection(_data?.data || 'root')
    },
    onCancel() {
      delVisible.value = false
    },
  })
}, 200)

// 复制
const onCopy = () => {
  if (unref(isSelectedRoot)) return
  formDesigner.setCopyData(selected.value || [])
}

// 剪切
const onShear = debounce(() => {
  if (unref(isSelectedRoot)) return
  formDesigner.setCopyData(selected.value || [])
  const _data: any = selected.value
    .map((item) => {
      return deleteDataByKey(formData.value.children, item)
    })
    .pop()
  formData.value = {
    ...formData.value,
    children: _data?.arr || [],
  }
  setSelection(_data?.data || 'root')
}, 200)

// 粘贴
const onPaste = () => {
  if (!selected.value?.length) return
  const _data = formDesigner.getCopyData()
  const list = (_data || []).map((item) => {
    return {
      ...item,
      key: item.key + '_copy',
    }
  })
  if (_data.length && selected.value?.length) {
    const dt = selected.value?.[selected.value.length - 1]
    if (dt?.key === 'root') {
      formData.value = {
        ...formData.value,
        children: [...formData.value?.children, ...list],
      }
    } else {
      formData.value = {
        ...formData.value,
        children: copyDataByKey(formData.value?.children, list, dt),
      }
    }
    setSelection(_data?.[_data.length - 1] || 'root')
    formDesigner.deleteData()
  }
}

// 收藏为模板
const onCollect = () => {
  if (unref(isSelectedRoot)) return
  collectData.value = selected.value || []
  collectVisible.value = true
}

watch(
  () => [keys['Ctrl+C'].value, keys['Meta+C'].value],
  (v1, v2) => {
    if (v1 || v2) {
      onCopy()
    }
  },
)

watch(
  () => [keys['Ctrl+X'].value, keys['Meta+X'].value],
  (v1, v2) => {
    if (v1 || v2) {
      onShear()
    }
  },
)

watch(
  () => [keys['Ctrl+V'].value, keys['Meta+V'].value],
  (v1, v2) => {
    if (v1 || v2) {
      onPaste()
    }
  },
)

// 删除
watch(
  () => [keys['Space'].value, keys['Delete'].value],
  (v1, v2) => {
    if (v1 || v2) {
      if (!delVisible.value) {
        onDelete()
      }
    }
  },
)

/**
 * 保存数据
 */
const onSaveData = () => {
  const obj = {
    ...props.data,
    configuration: {
      type: 'form',
      code: JSON.stringify(unref(formData)),
    },
  }
  product.update(obj)
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
  onDelete,
  onPaste,
  onCopy,
  onShear,
  onCollect,
})

const onSave = () => {
  if (model.value !== 'edit') {
    return new Promise(async (resolve, inject) => {
      const values = await formRef?.value.validateFields().catch((info) => {
        inject(info)
      })
      // console.log('Received values of form: ', values)
      resolve(values)
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

// 校验
const onValidate = () => {
  spinning.value = true
  errorKey.value = checkedConfig(unref(formData))
  spinning.value = false
  return new Promise((resolve, reject) => {
    if (errorKey.value?.length) {
      reject(errorKey.value)
    } else {
      resolve(true)
    }
  })
}

// 获取数据
const onInput = async (type: 'get' | 'set') => {
  if (type === 'set') {
    const obj = JSON.parse(editData?.value || '{}')
    Object.assign(formState, obj)
  } else {
    const obj = await onSave().catch(() => {})
    if (obj) {
      editData.value = JSON.stringify(obj)
    }
  }
}

defineExpose({ onSave, validate: onValidate })
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

.check {
  position: fixed;
  background-color: lightgray;
  padding: 10px 20px;
  width: 100%;
  bottom: 0;
}
</style>

