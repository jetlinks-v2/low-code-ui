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
      <p>后端功能</p>
      <j-form :model="dataBind" layout="vertical">
        <j-row :gutter="20">
          <j-col :span="20">
            <j-space>
              <j-form-item>
                <ErrorItem :errorData="errorData('function')">
                  <j-select
                    style="width: 200px;"
                    v-model:value="dataBind.data.function"
                    :disabled="functionDisabled"
                    placeholder="请选择功能"
                  >
                    <j-select-option
                      v-for="item in functionOptions"
                      :value="item.fullId"
                      :key="item.id"
                      :title="item.title + '.' + item.id "
                    >
                      {{ item.title + '.' + item.id }}
                    </j-select-option>
                  </j-select>
                </ErrorItem>
              </j-form-item>
              <j-form-item>
                <ErrorItem :errorData="errorData('command')">
                  <j-select
                    style="width: 200px;"
                    v-model:value="dataBind.data.command"
                    :disabled="commandDisabled"
                    placeholder="请选择指令"
                  >
                    <j-select-option
                      v-for="item in commandOptions"
                      :value="item.id"
                      :key="item.id"
                    >
                      {{ item.name }}
                    </j-select-option>
                  </j-select>
                </ErrorItem>
              </j-form-item>
            </j-space>
          </j-col>
          <j-col :span="4">
            <j-button type="link" @click="handleModify">变更</j-button>
          </j-col>
        </j-row>
        <j-row>
          <j-col :span="21">
            <j-form-item>
              <j-tree-select
                showSearch
                placeholder="请选择"
                multiple
                v-model:value="dataSource"
                :treeData="sourceList"
                :treeDefaultExpandedKeys="['output', 'inputs']"
                :treeCheckStrictly="false"
                @change="handleChangeData"
              />
            </j-form-item>
          </j-col>
        </j-row>
      </j-form>
    </div>

    <j-modal v-model:visible="visible" title="提示" @ok="handleOk">
      <p class="text">
        变更后将清空筛选组件及数据列表的所有数据<br />确认变更？
      </p>
    </j-modal>
  </j-drawer>
</template>

<script setup lang="ts">
import { ErrorItem } from '../../index'
import { DATA_BIND } from '../../keys'
import { useFunctions } from '@/hooks/useFunctions'

const { functionOptions, commandOptions, handleFunction } = useFunctions()

const visible = ref(false)

interface Emit {
  (e: 'update:open', value: boolean): void
  (e: 'valid'): void
}

const errorData = computed(() => {
  return (key: string): any => {
    return errorList.value.find((item) => item.key === key)
  }
})
const emits = defineEmits<Emit>()
const dataBind = inject(DATA_BIND)
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
    arr.push(findItem(sourceList.value, item))
  })
  dataBind.data.dataSource = arr.map((item) => {
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
const functionDisabled = computed(() => {
  return dataBind.data.function && dataBind.data.function !== ''
})

const commandDisabled = computed(() => {
  return dataBind.data.command && dataBind.data.command !== ''
})

const showCommand = computed(() => {
  return ['rdb-sql-query', 'rdb-crud'].includes(
    functionOptions!.value.find(
      (item) => item.fullId === dataBind.data.function,
    )?.provider || '',
  )
})

const handleModify = () => {
  visible.value = dataBind.data && dataBind.data.function
}

const handleOk = () => {
  dataBind.data.command = dataBind.data.function = null
  dataBind.filterAsync = dataBind.columnAsync = false
  dataBind.data.dataSource =
    dataBind.columnBind =
    dataBind.filterBind =
    dataSource.value =
      []
  visible.value = false
}

const errorList = computed(() => {
  return props.errorList
})

const sourceList = computed(() => {
  const _item = commandOptions.value?.find(
    (item) => item.id === dataBind.data.command,
  )
  const arr: any[] = []
  if (_item?.inputs) {
    arr.push({
      label: '输入',
      value: 'inputs',
      disabled: true,
      children: getArray(_item?.inputs || [], 'inputs'),
    })
  }
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
  () => dataBind.data.function,
  () => {
    if (dataBind.data.function) {
      handleChangeFunction(dataBind.data.function)
      dataSource.value = dataBind.data.dataSource?.map((item) => item.value)
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
</style>
