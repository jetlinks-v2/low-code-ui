<template>
  <div>
    <p>请配置可选项的数据来源</p>
    <j-form-item
      :validateFirst="true"
      :name="['componentProps', 'source', 'type']"
    >
      <j-radio-group
        v-model:value="data.type"
        button-style="solid"
        @change="onRadioChange"
      >
        <j-radio-button :value="'dic'">数据字典</j-radio-button>
        <j-radio-button :value="'end'">后端接口</j-radio-button>
      </j-radio-group>
    </j-form-item>
    <j-form-item
      :validateFirst="true"
      :name="['componentProps', 'source', 'dictionary']"
      v-if="data?.type === 'dic'"
    >
      <j-select
        placeholder="请选择"
        v-model:value="data.dictionary"
        @change="onDataChange"
      >
        <j-select-option v-for="item in dic" :key="item.id" :value="item.id">
          {{ item.name }}
        </j-select-option>
      </j-select>
    </j-form-item>
    <template v-else>
      <j-row :gutter="16">
        <j-col :span="12">
          <j-form-item
            :validateFirst="true"
            :name="['componentProps', 'source', 'functionId']"
          >
            <j-select
              v-model:value="data.functionId"
              placeholder="请选择"
              :options="functionList"
              allowClear
              @change="onFunChange"
            >
            </j-select>
          </j-form-item>
        </j-col>
        <j-col :span="12">
          <j-form-item
            :validateFirst="true"
            :rules="[
              {
                required: data?.functionId,
                message: '请选择',
                trigger: 'change',
              },
            ]"
            :name="['componentProps', 'source', 'commandId']"
          >
            <j-select
              v-model:value="data.commandId"
              placeholder="请选择"
              :options="commandList"
              allowClear
              @change="onCommandChange"
            ></j-select>
          </j-form-item>
        </j-col>
      </j-row>
    </template>
    <template v-if="data?.type === 'end'">
      <j-form-item
        :validateFirst="true"
        :name="['componentProps', 'source', 'source']"
      >
        <template #label>
          数据层级<j-tooltip title="选择树结构的数据在接口的哪一层">
            <AIcon type="QuestionCircleOutlined" />
          </j-tooltip>
        </template>
        <j-tree-select
          v-model:value="data.source"
          placeholder="请选择"
          style="width: 100%"
          allowClear
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="sourceList"
          @change="onSourceChange"
        >
        </j-tree-select>
      </j-form-item>
      <j-form-item
        :validateFirst="true"
        :name="['componentProps', 'source', 'label']"
      >
        <template #label>
          展示字段<j-tooltip title="选择树结构进行展示的数据">
            <AIcon type="QuestionCircleOutlined" />
          </j-tooltip>
        </template>
        <j-select
          v-model:value="data.label"
          placeholder="请选择"
          :options="labelList"
          allowClear
          @change="onDataChange"
        >
        </j-select>
      </j-form-item>
      <j-form-item
        :validateFirst="true"
        :name="['componentProps', 'source', 'value']"
      >
        <template #label>
          存入后端字段<j-tooltip title="选择树结构存入后端的数据">
            <AIcon type="QuestionCircleOutlined" />
          </j-tooltip>
        </template>
        <j-select
          v-model:value="data.value"
          placeholder="请选择"
          :options="labelList"
          allowClear
          @change="onDataChange"
        >
        </j-select>
      </j-form-item>
    </template>
  </div>
</template>
    
<script lang="ts" setup>
import { ref, watch, computed, reactive } from 'vue'
import { queryDictionary, queryEndCommands } from '@/api/form'
import { useProduct } from '@/store'
import { omit } from 'lodash-es'
import { cloneDeep } from 'lodash-es'

const product = useProduct()

const props = defineProps({
  value: {
    type: Object,
    default: () => {},
  },
})

const emits = defineEmits(['change'])

const data = reactive({
  dictionary: undefined,
  type: 'dic',
  // type: 'end',
  // label: undefined,
  // name: undefined,
  // functionId: undefined,
  // commandId: undefined,
  // source: undefined,
  // dictionary: undefined,
  // value: undefined,
})

watch(
  () => props.value,
  (newValue) => {
    Object.assign(data, newValue)
  },
  {
    deep: true,
    immediate: true,
  },
)

const dic = ref<any[]>([])
const end = ref<any[]>([])

const getDictionary = () => {
  queryDictionary().then((resp) => {
    if (resp.success) { // 过滤掉没有启用的数据
      dic.value = resp.result?.filter(item => item?.status) || []
    }
  })
}

const getEnd = () => {
  const id = product.info?.draftId
  queryEndCommands(id, ['rdb-crud']).then((resp) => {
    if (resp.success) {
      end.value = resp.result || []
    }
  })
}

const onRadioChange = (e) => {
  if (e.target?.value === 'end') {
    emits('change', {
      type: 'end',
      label: undefined,
      name: undefined,
      functionId: undefined,
      commandId: undefined,
      source: undefined,
    })
  } else {
    emits('change', {
      dictionary: undefined,
      type: 'dic',
    })
  }
}

const functionList = computed(() => {
  return (
    end.value?.map((item) => {
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
      .find((item) => data?.functionId === item.id)
      ?.command?.map((i) => {
        return {
          ...i,
          label: i.name,
          value: i.id,
        }
      }) || []
  )
})

const getArray = (arr: any[]) => {
  const _item = arr.find((i) => i.valueType?.type === 'array')
  if (_item) {
    return arr?.map((item) => {
      const children = item?.properties?.length ? getArray(item.properties) : []
      return {
        ...omit(item, 'properties'),
        label: item?.name,
        value: item?.id,
        children,
      }
    })
  } else {
    return []
  }
}

const sourceList = computed(() => {
  const properties =
    commandList.value.find((item) => item.id === data?.commandId)?.output
      ?.properties || []
  return getArray(properties)
})

const searchTree = (arr: any[], _item: any) => {
  let _data: any = undefined
  arr?.map((item) => {
    if (item.id === _item) {
      _data = item
      return
    }
    if (item.children?.length) {
      _data = searchTree(item.children, _item)
    }
  })
  return _data
}

const labelList = computed(() => {
  const _item = data?.source
  if (_item) {
    const _data = searchTree(sourceList.value, _item)
    if (_data?.valueType?.type === 'array') {
      return _data.valueType?.elementType?.properties?.map((item) => {
        return {
          label: item.name,
          value: item.id,
        }
      })
    }
  } else {
    return commandList.value
      .find((item) => item.id === data?.commandId)
      ?.output?.properties?.map((item) => {
        return {
          label: item.name,
          value: item.id,
        }
      })
  }
})

const onFunChange = (val: string) => {
  const obj = {
    type: 'end',
    functionId: val,
    commandId: undefined,
    source: undefined,
    label: undefined,
    value: undefined,
  }
  emits('change', obj)
}

const onCommandChange = () => {
  const obj = cloneDeep({ ...data })
  data.source = undefined
  data.label = undefined
  data.value = undefined
  emits('change', obj)
}

const onSourceChange = () => {
  const obj = cloneDeep({ ...data })
  data.label = undefined
  data.value = undefined
  emits('change', obj)
}

const onDataChange = () => {
  const obj = cloneDeep({ ...data })
  emits('change', obj)
}

watch(
  () => data?.type,
  (newVal) => {
    if (newVal === 'dic') {
      getDictionary()
    }
    if (newVal === 'end') {
      getEnd()
    }
  },
  {
    immediate: true,
  },
)
</script>