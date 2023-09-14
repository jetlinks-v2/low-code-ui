<template>
  <j-spin :spinning="spinning">
    <div class="container">
      <Header @save="onSave" :data="data" @validate="onValidate" />
      <div class="box">
        <div class="left" v-if="model !== 'preview'"><Filed /></div>
        <div
          class="right"
          :style="{
            width: _width,
          }"
        >
          <Canvas></Canvas>
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
  watch,
  onUnmounted,
  unref,
  computed,
  reactive,
  onMounted,
} from 'vue'
import { debounce } from 'lodash-es'
import { useProduct, useFormDesigner } from '@/store'
import { Modal } from 'jetlinks-ui-components'
import {
  deleteDataByKey,
  copyDataByKey,
  checkedConfig,
  getFieldData,
  initData,
  appendChildItem,
handleCopyData,
} from './utils/utils'
import { uid } from './utils/uid'

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
const errorKey = ref<string[]>([])
const configRef = ref<any>()
const refList = ref<any>({})
const formRef = ref<any>()
const formState = reactive({})

const collectVisible = ref<boolean>(false)
const collectData = ref<any[]>([])
const delVisible = ref<boolean>(false)
const spinning = ref<boolean>(false)
const checkVisible = ref<boolean>(false)
const editData = ref<string>()
const _ctrl = ref<boolean>(false)
const focus = ref<boolean>(false)
const focused = ref<boolean>(false)

const product = useProduct()
const formDesigner = useFormDesigner()

const isSelectedRoot = computed(() => {
  return !!selected.value.find((item) => item.key === 'root')
})

const _width = computed(() => {
  return model.value === 'preview'
    ? '100%'
    : !unref(isShowConfig)
    ? 'calc(100% - 200px)'
    : 'calc(100% - 584px)'
})

// 设置数据被选中
const setSelection = (node: any) => {
  if (['card-item', 'space-item'].includes(node.type)) return
  if (_ctrl.value && model.value === 'edit') {
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
  if (unref(isSelectedRoot) || !arr?.length || focused.value) return
  delVisible.value = true
  Modal.confirm({
    title: '确定删除组件及其配置？',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      delVisible.value = false
      // 删除数据
      const _data = deleteDataByKey(formData.value.children, selected.value)
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
  if (unref(isSelectedRoot) || focused.value) return
  formDesigner.setCopyData(selected.value || [])
}

// 剪切
const onShear = debounce(() => {
  if (unref(isSelectedRoot) || focused.value) return
  formDesigner.setCopyData(selected.value || [])
  const _data: any = deleteDataByKey(formData.value.children, selected.value)
  formData.value = {
    ...formData.value,
    children: _data?.arr || [],
  }
  setSelection(_data?.data || 'root')
}, 200)

// 粘贴
const onPaste = () => {
  if (!selected.value?.length || focused.value) return
  const _data = formDesigner.getCopyData()
  const list = (_data || []).map((item) => {
    return {
      ...item,
      formItemProps: {
        ...item?.formItemProps,
        name: item.formItemProps?.name + 'copy',
      },
      key: item.key + '_' + uid(),
      children: handleCopyData(item?.children || [])
    }
  })
  if (list.length && selected.value?.length) {
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
    setSelection(list?.[list.length - 1] || 'root')
    formDesigner.deleteData()
  }
}

// 收藏为模板
const onCollect = () => {
  if (unref(isSelectedRoot)) return
  collectData.value = selected.value || []
  collectVisible.value = true
}

// 添加子组件
const onAddChild = (newData: any, parent: any, flag?: boolean) => {
  const arr = appendChildItem(formData.value?.children, newData, parent, flag)
  formData.value = {
    ...formData.value,
    children: arr || [],
  }
  setSelection(newData || 'root')
}

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

provide('FormDesigner', {
  tabsId: props.data?.id,
  model,
  formData,
  formState,
  formRef,
  isShowConfig,
  selected,
  errorKey,
  mode: props?.mode,
  refList,
  collectVisible,
  collectData,
  delVisible,
  _ctrl,
  focus,
  focused, // 其他组件
  setSelection,
  setModel,
  onSaveData,
  onDelete,
  onPaste,
  onCopy,
  onShear,
  onCollect,
  onAddChild,
})

const onSave = () => {
  if (model.value === 'preview') {
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

onMounted(() => {
  setSelection('root')
})

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
  height: calc(100vh - 125px);
  .box {
    display: flex;
    width: 100%;
    height: calc(100% - 50px);
    overflow: hidden;

    .left {
      width: 200px;
      height: 100%;
    }

    .right {
      width: 100%;
    }

    .config {
      width: 384px;
    }
  }
}

.check {
  position: fixed;
  background-color: lightgray;
  padding: 10px 20px;
  width: 100%;
  bottom: 25px;
}
</style>

