<template>
  <j-drawer
    title="数据绑定"
    placement="right"
    width="560px"
    :closable="true"
    :visible="open"
    :getContainer="() => elContainer"
    :wrap-style="{ position: 'absolute', zIndex: 1, overflow: 'hidden' }"
    :destroyOnClose="true"
    @close="emits('update:open', false)"
  >
    <div class="data-bind-modal">
      <j-form :model="form" layout="vertical">
        <j-form-item>
          <j-space>
            <j-button type="link" @click="handleModify" :disabled="!form.async">变更</j-button>
            <j-button
              myIcon="SyncOutlined"
              size="small"
              type="primary"
              :disabled="!form.async"
              @click="handleFunctionChange"
            >
              同步功能变动
            </j-button>
          </j-space>
        </j-form-item>
        <j-row :gutter="20">
          <j-col :span="24">
            <j-space style="align-items: start;">
              <j-form-item>
                <ErrorItem :errorData="errorData('function')">
                  <a-select
                    style="width: 200px;"
                    v-model:value="form.data.function"
                    :disabled="form.async"
                    placeholder="请选择功能"
                    optionFilterProp="title"
                    show-search
                  >
                    <a-select-option
                      v-for="item in functionOptions"
                      :value="item.fullId"
                      :key="item.id"
                      :title="item.title"
                    >
                      <img class="options-img" :src="getImages(item.type)">
                      {{ item.title }}
                    </a-select-option>
                  </a-select>
                </ErrorItem>
              </j-form-item>
              <j-form-item>
                <ErrorItem :errorData="errorData('command')">
                  <a-select
                    style="width: 200px;"
                    v-model:value="form.data.command"
                    :disabled="form.async"
                    placeholder="请选择指令"
                    optionFilterProp="label"
                    show-search
                  >
                    <a-select-option
                      v-for="item in commandOptions"
                      :value="item.id"
                      :key="item.id"
                      :title="item.name"
                      :label="item.name"
                    >
                      {{ item.name }}({{ item.id }})
                    </a-select-option>
                  </a-select>
                </ErrorItem>
              </j-form-item>
            </j-space>
          </j-col>
        </j-row>
        <j-row>
          <j-col :span="21">
            <j-form-item>
              <ErrorItem :errorData="errorData('dataSource')">
                <j-tree-select
                  showSearch
                  placeholder="请选择"
                  multiple
                  :disabled="form.async && !reselect"
                  v-model:value="form.data.dataSource"
                  :treeData="sourceList"
                  :treeDefaultExpandedKeys="['output', 'inputs']"
                  :treeCheckStrictly="false"
                  @change="handleChangeData"
                />
              </ErrorItem>
            </j-form-item>
          </j-col>
        </j-row>
      </j-form>
    </div>

    <template #footer>
      <j-space>
        <j-button @click="emits('update:open', false)">取消</j-button>
        <j-button type="primary" @click="handleSubmit">确定</j-button>
      </j-space>
    </template>
    <j-modal v-model:visible="visible" title="提示" @ok="handleOk">
      <p class="text">
        列表页中引用自当前功能的数据将同步变更
      </p>
    </j-modal>
    <j-modal v-model:visible="changeModalVisible" title="提示" @ok="handleAsync">
      <p class="text">
        已同步所有数据变动，请重新绑定
      </p>
    </j-modal>
  </j-drawer>
</template>

<script setup lang="ts">
import { ErrorItem } from '../../index'
import { DATA_BIND, DATA_SOURCE, SEARCH_DATA } from '../../keys'
import { useFunctions } from '@/hooks/useFunctions'
import { useImages } from '@/components/ListPage/hooks/useImages'
import { cloneDeep } from 'lodash-es';
import { onlyMessage, randomString } from '@jetlinks/utils';
import { queryCommand } from '@/api/project';

const { functionOptions, commandOptions, info, handleFunction } = useFunctions()
const { getImages } = useImages()

const visible = ref(false)
const changeModalVisible = ref(false)
const reselect = ref(false)

interface Emit {
  (e: 'update:open', value: boolean): void
  (e: 'update:dataSource', value: any[]): void
  (e: 'update:searchData', value: any[]): void
  (e: 'valid'): void
}

const errorData = computed(() => {
  return (key: string): any => {
    return errorList.value.find((item) => item.key === key)
  }
})
const emits = defineEmits<Emit>()
let dataBind = inject(DATA_BIND)
const columnData = inject(DATA_SOURCE)
const searchData = inject(SEARCH_DATA)
const form = reactive(cloneDeep(dataBind))
let newData = [];
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  elContainer: {
    type: Object,
  },
  errorList: {
    type: Array,

    default: () => {},
  },
})

const dataSource = ref<any[]>([])
const handleChangeFunction = (val: string) => {
  // dataBind.filterBind = dataBind.columnBind =
  //   functionOptions!.value.find((item) => item.fullId === val)?.configuration
  //     ?.columns || dataBind.filterBind
  handleFunction(val)
}

const handleChangeData = (e: string[]) => {
  let arr: any[] = []
  e.forEach((item) => {
    const result = findItem(sourceList.value, item)
    if(result) {
      arr.push(result)
    }
  })
  form.data.dataSource = arr.map((item) => {
    return {
      id: item.id,
      name: item.name,
      type: item.valueType?.type,
      value: item.value,
    }
  })
}

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


const handleModify = () => {
  visible.value = form.data && form.data.function
}

const handleOk = () => {
  form.data.command = form.data.function = dataBind.data.command = dataBind.data.function = null
  form.async = dataBind.async = false
  form.data.dataSource = dataBind.data.dataSource = []
  visible.value = false
}

const handleAsync = () => {
  reselect.value = true;
  changeModalVisible.value = false;
  form.data.dataSource = dataBind.data.dataSource = form.data.dataSource.filter((item) => {
    const result = findItem(sourceList.value, item.value)
    if(result) {
      return item
    }
  })
}

enum javaType {
  enum = 'enum',
  string = 'text',
  double = 'double',
  int = 'int',
  bigDecimal = 'text',
  dateTime = 'date',
  date = 'date',
  float = 'float',
  byte = 'int',
  long = 'long',
  list = 'array',
  boolean = 'boolean',
  object = 'object',
  array = 'array'
}

enum filterType {
  enum = 'enum',
  string = 'string',
  double = 'number',
  int = 'number',
  bigDecimal = 'string',
  dateTime = 'date',
  date = 'date',
  float = 'number',
  byte = 'number',
  long = 'number',
  list = 'string',
  boolean = 'enum',
  map = 'string',
  object = 'enum',
  array = 'string'
}

const handleSubmit = () => {
  form.async = true;
  form.dataFrom = commandOptions.value?.find(item => item.id === form.data.command)?.output
  dataBind = Object.assign(dataBind, form)
  columnData.value = [...columnData.value.filter(item => item.mark === 'add'), ...dataBind.data.dataSource.map(item => {
    return {
      rowKey: randomString(8),
      ...item,
      type: javaType[item.type],
    }
  })]
  searchData.value = [...searchData.value.filter(item => item.mark === 'add'), ...dataBind.data.dataSource.map(item => {
    return {
      rowKey: randomString(8),
      ...item,
      type: filterType[item.type],
    }
  })]
  emits('update:open', false)
}

const handleFunctionChange = () => {
  queryCommand(info.value.draftId, []).then(res => {
    const result = res.result?.find(item => item.moduleId + '.' + item.id === form.data.function)?.command || []
    newData = result.find(item => item.id === form.data.command)?.output
    if(JSON.stringify(newData) !== JSON.stringify(form.dataFrom)) {
      changeModalVisible.value = true;
    } else {
      onlyMessage('已是最新数据')
    }
  })
}

const errorList = computed(() => {
  return props.errorList
})

const sourceList = computed(() => {
  const _item = commandOptions.value?.find(
    (item) => item.id === form.data.command,
  )
  const arr: any[] = []
  if (_item?.output && _item?.output?.properties?.length) {
    arr.push({
      label: '输出',
      value: 'output',
      disabled: true,
      children: getArray(_item?.output?.properties || [], 'output'),
    })
  }
  return arr
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
      disabled: children.length !== 0,
      children,
    }
  })
}

watch(
  () => form.data.function,
  () => {
    if (form.data.function) {
      handleChangeFunction(form.data.function)
      dataSource.value = form.data.dataSource?.map((item) => item.value)
    }
  },
  { immediate: true },
)
</script>

<style scoped lang="less">
.data-bind-modal {
  background-color: #f7f8f9;
  border: 1px solid #f0f2f5;
  padding: 16px;
}
.text {
  text-align: center;
}
</style>
