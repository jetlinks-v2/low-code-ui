<template>
  <div class="quick">
    <j-button type="link" @click="visible = true">快速添加</j-button>
    <j-drawer
      :destroyOnClose="true"
      v-model:visible="visible"
      title="快速添加"
      placement="right"
      :width="550"
    >
      <p>自由组合快速添加表单页内容</p>
      <div class="content">
        <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
          <j-row :gutter="24">
            <j-col :span="12">
              <j-form-item label="后端功能" :name="['source', 'functionId']">
                <a-select
                  showSearch
                  placeholder="请选择"
                  v-model:value="modelRef.source.functionId"
                  @change="onFunChange"
                  allowClear
                >
                  <a-select-option
                    :key="item.value"
                    v-for="item in functionList"
                    :value="item.value"
                  >
                    <span>
                      <img
                        :src="typeImages[item.type]"
                        style="width: 20px; height: 20px; margin-right: 5px"
                      />
                      {{ item.label }}
                    </span>
                  </a-select-option>
                </a-select>
              </j-form-item>
            </j-col>
            <j-col :span="12">
              <j-form-item
                :rules="[
                  {
                    required: modelRef.source.functionId,
                    message: '请选择',
                  },
                ]"
                :name="['source', 'commandId']"
                style="padding-top: 28px"
              >
                <j-select
                  showSearch
                  placeholder="请选择"
                  v-model:value="modelRef.source.commandId"
                  :options="commandOptions"
                  @change="onCommChange"
                  allowClear
                />
              </j-form-item>
            </j-col>
          </j-row>
          <j-form-item :name="['source', 'inputs']" label="输入">
            <j-tree-select
              showSearch
              placeholder="请选择"
              v-model:value="modelRef.source.inputs"
              :treeData="inputsList"
              multiple
              allowClear
              :treeCheckStrictly="false"
            />
          </j-form-item>
          <j-form-item :name="['source', 'output']" label="输出">
            <j-tree-select
              showSearch
              placeholder="请选择"
              v-model:value="modelRef.source.output"
              :treeData="outputList"
              multiple
              allowClear
              :treeCheckStrictly="false"
            />
          </j-form-item>
          <j-form-item name="json" label="复制json">
            <Editor
              :height="300"
              language="json"
              v-model:value="modelRef.json"
            />
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
import Editor from '@LowCode/components/EditorModal'
import { queryEndCommand } from '@LowCode/api/form'
import { useProduct } from '@LowCode/store'
import { onlyMessage } from '@jetlinks-web/utils'
import { providerEnum } from '@LowCode/components/ProJect'
import generatorData from '../../utils/generatorData'
import { map, uniqBy } from 'lodash-es'
import { uid } from '../../utils/uid'
import { typeImages } from '@LowCode/components/ProJect/index'

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
    inputs: undefined,
    output: undefined,
  },
})

const end = ref<any[]>([])

const getEnd = () => {
  const id = product.info?.draftId
  queryEndCommand(id, []).then((resp) => {
    if (resp.success) {
      const _map = product.getDataMap()
      end.value = (resp.result || []).map((item) => {
        return {
          ...item,
          type: _map.get(item.id)?.type,
        }
      })
    }
  })
}

const functionList = computed(() => {
  return (
    end.value.map((item) => {
      return {
        ...item,
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
      ?.command?.map((i) => {
        return {
          ...i,
          label: i.name,
          value: i.id,
        }
      }) || []
  )
})

const commandOptions = computed(() => {
  return (
    commandList.value.map((i) => {
      return {
        label: i.name,
        value: i.id,
      }
    }) || []
  )
})

const getArray = (arr: any[], _disabled: any[]) => {
  return (arr || []).map((i) => {
    let children: any[] = []
    if (i.valueType.type === 'array') {
      children = getArray(i.valueType?.elementType?.properties || [], _disabled)
    }
    if (i.valueType.type === 'object') {
      children = getArray(i.valueType?.properties || [], _disabled)
    }
    return {
      ...i,
      value: i.id,
      label: `${i.id}${i?.name ? '(' + i?.name + ')' : ''}`,
      disabled: _disabled.includes(i.id),
      children,
    }
  })
}

const inputsList = computed(() => {
  const _item = commandList.value.find(
    (item) => item.id === modelRef?.source?.commandId,
  )
  return getArray(_item?.inputs || [], modelRef.source.output || [])
})

const outputList = computed(() => {
  const _item = commandList.value.find(
    (item) => item.id === modelRef?.source?.commandId,
  )
  return getArray(_item?.output?.properties || [], modelRef.source.inputs || [])
})

const onFunChange = () => {
  modelRef.source.commandId = undefined
  modelRef.source.inputs = undefined
  modelRef.source.output = undefined
}

const onCommChange = () => {
  modelRef.source.inputs = undefined
  modelRef.source.output = undefined
}

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

const generatorTableSource = (_item: any) => {
  const _type = _item.valueType.type || 'string'
  let type: string = 'input'
  switch (_type) {
    case 'long':
    case 'int':
    case 'float':
    case 'double':
      type = 'input-number'
      break
    case 'boolean':
      type = 'switch'
      break
    case 'date':
      type = 'date-picker'
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
  return {
    ...obj,
    children,
    formItemProps: {
      ...obj.formItemProps,
      name: _item.id,
    },
  }
}

const generatorSource = (_item: any) => {
  const _type = _item.valueType.type || 'string'
  let type: string = 'input'
  switch (_type) {
    case 'object':
      type = 'form'
      break
    case 'array':
      type = 'table'
      break
    case 'long':
    case 'int':
    case 'float':
    case 'double':
      type = 'input-number'
      break
    case 'boolean':
      type = 'switch'
      break
    case 'date':
      type = 'date-picker'
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
  if (_type === 'object') {
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
  if (_type === 'array') {
    children = _item.children?.map((i) => {
      const _data = generatorTableSource(i)
      return {
        type: 'table-item',
        key: `table-item_${uid()}`,
        componentProps: {
          name: '列名' + uid(6),
          colSpan: 1,
          align: 'left',
        },
        children: [
          {
            ..._data,
            componentProps: {
              ..._data.componentProps,
              name: i.name,
            },
          },
        ],
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

const handleSource = (arr: any[], list: any[]) => {
  const _array = arr
    .map((item) => {
      return findItem(list, item)
    })
    .map((i) => {
      return generatorSource(i)
    })
  return _array
}

const onSaveData = (_data: any) => {
  const obj = {
    ...props.data,
    configuration: {
      type: 'form',
      code: JSON.stringify(unref(designer.formData)),
    },
    others: {
      ...props.data.others,
      quickData: _data,
    },
  }
  product.update(obj)
}

const onSave = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return
  const obj: any = {
    json: undefined,
    formCopy: undefined,
    inputs: undefined,
    output: undefined,
  }
  // 处理后端功能数据
  obj.inputs = handleSource(modelRef?.source?.inputs || [], unref(inputsList))
  obj.output = handleSource(modelRef?.source?.output || [], unref(outputList))
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
    ...(obj?.inputs || []),
    ...(obj?.output || []),
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
    onSaveData(modelRef)
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
  onSaveData(modelRef)
  modalVisible.value = false
  visible.value = false
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

watch(
  () => props.data?.others?.quickData,
  (newVal) => {
    if (newVal) {
      Object.assign(modelRef, newVal)
    } else {
      modelRef.json = undefined
      modelRef.formCopy = []
      modelRef.source = {
        functionId: undefined,
        commandId: undefined,
        inputs: undefined,
        output: undefined,
      }
    }
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>

<style lang="less" scoped>
.content {
  background-color: #f7f8f9;
  border: 1px solid #f0f2f5;
  padding: 16px;
}
.btn {
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  right: 0;
  // justify-content: flex-end;
  padding: 10px 24px;
  border-top: 1px solid #f0f0f0;
  background-color: #ffffff;
}
</style>

