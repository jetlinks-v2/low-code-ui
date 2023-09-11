<template>
  <div class="quick">
    <j-button type="primary" @click="visible = true">快速添加</j-button>
    <j-drawer
      :destroyOnClose="true"
      v-model:visible="visible"
      title="快速添加"
      placement="right"
    >
      <p>自由组合快速添加表单页内容</p>
      <div class="content">
        <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
          <j-form-item label="后端功能">
            <j-row :gutter="24">
              <j-col :span="12">
                <j-select
                  showSearch
                  placeholder="请选择"
                  :options="functionList"
                  v-model:value="modelRef.source.functionId"
                  @change="onFunChange"
                  allowClear
                />
              </j-col>
              <j-col :span="12">
                <j-select
                  showSearch
                  placeholder="请选择"
                  v-model:value="modelRef.source.commandId"
                  :options="commandList"
                  @change="onCommChange"
                  allowClear
                />
              </j-col>
            </j-row>
          </j-form-item>
          <j-form-item name="sourceData">
            <j-tree-select
              showSearch
              placeholder="请选择"
              v-model:value="modelRef.source.sourceData"
              :treeData="sourceList"
              multiple
              allowClear
              :treeDefaultExpandedKeys="['output', 'inputs']"
              :treeCheckStrictly="false"
            />
          </j-form-item>
          <j-form-item name="json" label="复制json">
            <Editor language="json" v-model:value="modelRef.json" />
          </j-form-item>
          <j-form-item label="复制表单" placeholder="请选择" name="formCopy">
            <j-select
              :options="formDataOptions"
              placeholder="请选择"
              mode="multiple"
              v-model:value="modelRef.formCopy"
            />
          </j-form-item>
        </j-form>
      </div>
      <div class="btn">
        <j-space>
          <j-button @click="visible = false">取消</j-button>
          <j-button type="primary" @click="onSave">确定</j-button>
        </j-space>
      </div>
    </j-drawer>
    <j-modal
      v-model:visible="modalVisible"
      @ok="onOk"
      @cancel="modalVisible = false"
    >
      <p>数据重复，请选择处理方式</p>
      <j-radio-group v-model:value="value" name="radioGroup">
        <j-radio :value="true">覆盖当前组件</j-radio>
        <j-radio :value="false">忽略保留当前组件</j-radio>
      </j-radio-group>
    </j-modal>
  </div>
</template>
  <script lang="ts" setup>
import { ref, reactive, computed, inject, unref, watch } from 'vue'
import Editor from '@/components/EditorModal'
import { queryEndCommands } from '@/api/form'
import { useProduct } from '@/store'
import { onlyMessage } from '@jetlinks/utils'
import { providerEnum } from '@/components/ProJect'
import generatorData from '../../utils/generatorData'
import { map, uniqBy } from 'lodash-es'

const product = useProduct()
const designer: any = inject('FormDesigner')

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
})

const visible = ref<boolean>(false)
const modalVisible = ref<boolean>(false)

const formRef = ref()
const value = ref<boolean>(true)

const dataList = ref<any[]>([])

const modelRef = reactive({
  json: undefined,
  formCopy: [],
  source: {
    functionId: undefined,
    commandId: undefined,
    sourceData: undefined,
  },
})

const end = ref<any[]>([])

const getEnd = () => {
  const id = product.info?.draftId
  queryEndCommands(id, []).then((resp) => {
    if (resp.success) {
      end.value = resp.result || []
    }
  })
}

const functionList = computed(() => {
  return (
    end.value.map((item) => {
      return {
        label: item.name + '.' + item.id,
        value: item.id,
      }
    }) || []
  )
})

const commandList = computed(() => {
  return (
    end.value
      .find((item) => modelRef.source?.functionId === item.id)
      ?.command.map((i) => {
        return {
          ...i,
          label: i.name,
          value: i.id,
        }
      }) || []
  )
})

const getArray = (arr: any[], parentId: string) => {
  return (arr || []).map((i) => {
    let children: any[] = []
    if (i.valueType.type === 'array') {
      children = getArray(i.valueType?.elementType?.properties || [], i.id)
    }
    if (i.valueType.type === 'object') {
      children = getArray(i.valueType?.properties || [], i.id)
    }
    return {
      ...i,
      parentId,
      label: `${i.id}${i?.name ? '(' + i?.name + ')' : ''}`,
      value: `${i.id}_${parentId}`,
      children,
    }
  })
}

const sourceList = computed(() => {
  const _item = commandList.value.find(
    (item) => item.id === modelRef?.source?.commandId,
  )
  const arr: any[] = []
  if (_item?.inputs) {
    arr.push({
      label: '输入',
      value: 'inputs',
      disabled: true,
      children: getArray(_item?.inputs || [], ''),
    })
  }
  if (_item?.output && _item?.output?.properties?.length) {
    arr.push({
      label: '输出',
      value: 'output',
      disabled: true,
      children: getArray(_item?.output?.properties || [], ''),
    })
  }
  return arr
})

const onFunChange = () => {
  modelRef.source.commandId = undefined
  modelRef.source.sourceData = undefined
}

const onCommChange = () => {
  modelRef.source.sourceData = undefined
}

watch(
  () => visible.value,
  () => {
    if (visible.value) {
      getEnd()
    }
  },
  {
    immediate: true,
  },
)

const formDataOptions = computed(() => {
  const arr = product.getDataMapByType(providerEnum.FormPage)
  return arr
    .filter((item) => {
      return item.id !== props.data?.id
    })
    .map((i) => {
      return {
        ...i,
        label: i.name,
        value: i.id,
      }
    })
})

const findItem = (arr: any[], value: string) => {
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index]
    if (element.value === value) {
      return element
    }
    let _value = undefined
    if (element.children?.length) {
      _value = findItem(element.children, value)
    }
    if (_value) {
      return _value
    }
  }
}

const generatorSource = (_item: any) => {
  const _type = _item.valueType.type || 'string'
  let type: string = 'input'
  switch (_type) {
    case 'enum':
      type = 'select'
      break
    case 'file':
      type = 'file'
      break
    case 'date':
      type = 'date-picker'
      break
    case 'array':
      type = 'table'
      break
    case 'boolean':
      type = 'switch'
      break
    case 'password':
      type = 'input-password'
      break
    case 'object':
      type = 'form'
      break
    default:
      type = 'input'
      break
  }
  const obj = generatorData({
    type: type,
    name: _item?.name,
  })
  let children: any = []
  if (_type === 'array' || _type === 'object') {
    children = _item.children?.map((i) => {
      const _data = generatorSource(i)
      return {
        ..._data,
        componentProps: {
          ..._data.componentProps,
          name: i.name,
        },
      }
    })
  }
  return {
    ...obj,
    children,
    formItemProps: {
      ...obj.formItemProps,
      name: _item.id,
    },
  }
}

const handleSource = (arr: any[]) => {
  const _array = arr
    .map((item) => {
      return findItem(sourceList.value, item)
    })
    .map((i) => {
      return generatorSource(i)
    })
  return _array
}

const onSave = () => {
  const obj: any = {
    json: undefined,
    formCopy: undefined,
    sourceData: undefined,
  }
  // 处理后端功能数据
  obj.sourceData = handleSource(modelRef?.source?.sourceData || [])
  // 处理json
  try {
    const _json = JSON.parse(modelRef?.json || '[]')
    obj.json = Array.isArray(_json) ? _json : [_json]
  } catch (error) {
    onlyMessage('json格式错误', 'error')
  }
  // 处理表单数据
  obj.formCopy = formDataOptions.value
    .filter((item: any) => item?.id && modelRef.formCopy?.includes(item?.id))
    .map((i) => {
      return JSON.parse(i.configuration?.code || '{}')
    })
  const arr: any[] = []
  ;[
    ...(obj?.sourceData || []),
    ...(obj?.json || []),
    ...(obj?.formCopy || []),
  ].map((item) => {
    if (item.type === 'root') {
      return (item?.children).map((i) => {
        arr.push(i)
      })
    } else {
      arr.push(item)
    }
  })
  dataList.value = uniqBy(arr, 'formItemProps.name')
  const names = map(dataList.value, 'formItemProps.name')
  const difference = designer.formData.value?.children.find((i) =>
    names.includes(i?.formItemProps?.name),
  )
  if (difference) {
    modalVisible.value = true
  } else {
    designer.formData.value = {
      ...designer.formData.value,
      children: [...designer.formData.value.children, ...dataList.value],
    }
    visible.value = false
  }
}

const onOk = () => {
  let arr: any[] = []
  if (unref(value)) {
    arr = [...dataList.value, ...designer.formData.value.children]
  } else {
    arr = [...designer.formData.value.children, ...dataList.value]
  }
  designer.formData.value = {
    ...designer.formData.value,
    children: uniqBy(arr, 'formItemProps.name'),
  }
  modalVisible.value = false
  visible.value = false
}
</script>

<style lang="less" scoped>
.btn {
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  right: 0;
  justify-content: flex-end;
  padding: 10px 24px;
  border-top: 1px solid #f0f0f0;
  background-color: #ffffff;
}
</style>
  
  