<template>
  <div class="container">
    <Header @save="onSave" :data="data" @validate="onValid" />
    <div class="box">
      <div class="left" v-if="model !== 'preview'"><Filed /></div>
      <div
        class="right"
        :style="{
          width: _width,
        }"
      >
        <div class="canvas-box">
          <div class="container">
            <Canvas></Canvas>
          </div>
        </div>
      </div>
      <div class="config" v-if="isShowConfig && model !== 'preview'">
        <Config ref="configRef" />
      </div>
    </div>
    <Check v-if="model === 'preview' && !mode" />
    <CheckSpin :spinning="spinning" />
  </div>
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
  watchEffect,
} from 'vue'
import { debounce, map } from 'lodash-es'
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
import Check from './components/Check/index.vue'
import { onlyMessage } from '@jetlinks/utils'
import { queryDictionary } from '@/api/form'

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
const _ctrl = ref<boolean>(false)
const _other = ref<boolean>(false)
const focus = ref<boolean>(false)
const focused = ref<boolean>(false)
const dictionary = ref<any[]>([])

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
  if (['card-item'].includes(node.type)) {
    onSaveData()
    return
  }
  if (_ctrl.value && model.value === 'edit' && !_other.value) {
    if (node === 'root') {
      onSaveData()
      return
    }
    if (map(selected.value, 'key').includes('root')) {
      selected.value = [node]
    } else {
      if (!map(selected.value, 'key').includes(node.key)) {
        selected.value.push(node)
      }
    }
  } else {
    selected.value = []
    if (node === 'root') {
      selected.value.push(formData.value)
    } else {
      selected.value.push(node)
    }
  }
  isShowConfig.value =
    !(selected.value?.length > 1) &&
    !map(selected.value, 'type').includes('space-item')
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
  const list = selected.value.filter((item) => {
    return ![
      'collapse-item',
      'tabs-item',
      'grid-item',
      'table-item',
      'space-item',
    ].includes(item.type)
  })
  if (unref(isSelectedRoot) || focused.value) return
  formDesigner.setCopyData(props.data?.id, list || [])
}

// 剪切
const onShear = debounce(() => {
  if (unref(isSelectedRoot) || focused.value) return
  formDesigner.setCopyData(props.data?.id, selected.value || [])
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
  const obj = formDesigner.getCopyData()
  const list = (obj?.list || []).map((item) => {
    return {
      ...item,
      formItemProps: {
        ...item?.formItemProps,
        label:
          obj.key === props.data?.id
            ? 'copy_' + item.formItemProps?.label
            : item.formItemProps?.label,
        name:
          obj.key === props.data?.id
            ? 'copy_' + item.formItemProps?.name
            : item.formItemProps?.name,
      },
      key: item.key + '_' + uid(),
      children: handleCopyData(item?.children || []),
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
  _other,
  focus,
  focused, // 其他组件
  dictionary,
  setSelection,
  setModel,
  onSaveData,
  onDelete,
  onPaste,
  onCopy,
  onShear,
  onCollect,
  onAddChild,
  onSave,
})

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
const onValidate = async () => {
  if (!dictionary.value?.length) {
    const resp = await queryDictionary()
    if (resp.success) {
      // 过滤掉没有启用的数据
      dictionary.value = resp.result?.filter((item) => item?.status) || []
    }
  }
  errorKey.value = checkedConfig(unref(formData), dictionary.value)
  return new Promise((resolve, reject) => {
    if (errorKey.value?.length) {
      reject(errorKey.value)
    } else {
      resolve(true)
    }
  })
}

const onValid = async () => {
  spinning.value = true
  const _val = await onValidate().catch(() => {
    spinning.value = false
  })
  spinning.value = false
  if (_val) {
    onlyMessage('校验通过')
  }
}

defineExpose({ onSave, validate: onValidate })
</script>

<style lang="less" scoped>
.container {
  height: calc(100vh - 132px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .box {
    display: flex;
    width: 100%;
    overflow: hidden;
    flex: 1;
    .left {
      width: 200px;
      height: 100%;
    }

    .right {
      width: 100%;
      .canvas-box {
        width: 100%;
        height: 100%;
        padding: 24px;
        background-color: #f6f6f6;

        .container {
          height: 100%;
          background-color: #fff;
          border-radius: 8px;
          padding: 12px 0;
        }
      }
    }

    .config {
      width: 384px;
    }
  }
}
</style>

