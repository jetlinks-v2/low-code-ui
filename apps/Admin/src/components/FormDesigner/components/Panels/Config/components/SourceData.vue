<template>
  <div>
    <j-form-item
      :validateFirst="true"
      label="请配置可选项的数据来源"
      :name="['componentProps', 'source', 'type']"
      :rules="[
        {
          message: '请选择',
          required: true,
        },
      ]"
    >
      <!-- <j-radio-group
        v-model:value="data.type"
        button-style="solid"
        @change="onRadioChange"
      >
        <j-radio-button :value="'dic'">数据字典</j-radio-button>
        <j-radio-button :value="'end'">后端接口</j-radio-button>
      </j-radio-group> -->
      <CheckButton
        :options="[
          { label: '数据字典', value: 'dic' },
          { label: '后端接口', value: 'end' },
        ]"
        @change="onRadioChange"
        v-model:value="data.type"
      />
    </j-form-item>
    <j-form-item
      :validateFirst="true"
      :name="['componentProps', 'source', 'dictionary']"
      v-if="data?.type === 'dic'"
      :rules="rules"
    >
      <j-select
        placeholder="请选择"
        v-model:value="data.dictionary"
        showSearch
        @change="onDataChange"
      >
        <j-select-option
          :label="item.name"
          v-for="item in dic"
          :key="item.id"
          :value="item.id"
        >
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
            :rules="[
              {
                message: '请选择',
                required: true,
              },
            ]"
          >
            <j-select
              v-model:value="data.functionId"
              placeholder="请选择"
              :options="functionList"
              allowClear
              showSearch
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
                message: '请选择',
                required: true,
              },
            ]"
            :name="['componentProps', 'source', 'commandId']"
          >
            <j-select
              v-model:value="data.commandId"
              placeholder="请选择"
              :options="commandList"
              allowClear
              showSearch
              @change="onCommandChange"
            ></j-select>
          </j-form-item>
        </j-col>
      </j-row>
    </template>
    <template v-if="data?.type === 'end'">
      <j-form-item
        :validateFirst="true"
        v-if="isSource"
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
        :rules="[
          {
            message: '请选择',
            required: true,
          },
        ]"
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
          showSearch
          @change="onDataChange"
        >
        </j-select>
      </j-form-item>
      <j-form-item
        :validateFirst="true"
        :name="['componentProps', 'source', 'value']"
        :rules="[
          {
            message: '请选择',
            required: true,
          },
        ]"
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
          showSearch
          @change="onDataChange"
        >
        </j-select>
      </j-form-item>
    </template>
  </div>
</template>
    
<script lang="ts" setup>
import { ref, watch, computed, reactive, inject } from 'vue'
import { queryDictionary, queryEndCommands } from '@/api/form'
import { useProduct } from '@/store'
import { cloneDeep, omit } from 'lodash-es'

const product = useProduct()
const designer: any = inject('FormDesigner')

const props = defineProps({
  value: {
    type: Object,
    default: () => {
      return {
        dictionary: undefined,
        type: 'dic',
      }
    },
  },
})

const emits = defineEmits(['change'])

const data = reactive<any>({})

watch(
  () => props.value,
  (newValue) => {
    const obj = newValue || {
      dictionary: undefined,
      type: 'dic',
    }
    if (data.type === 'dic') {
      data.dictionary = obj.dictionary
      data.type = 'dic'
    } else {
      Object.assign(data, cloneDeep(obj))
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

const dic = ref<any[]>([])
const end = ref<any[]>([])

const rules = [
  {
    required: true,
    message: '请选择',
  },
  {
    validator(_rule: any, value: string) {
      const item = dic.value.find((i) => i?.id === value)
      if (!item) {
        return Promise.reject(`数字字典已被删除或禁用`)
      }
      return Promise.resolve()
    },
    trigger: 'change',
  },
]

const getDictionary = () => {
  queryDictionary().then((resp) => {
    if (resp.success) {
      // 过滤掉没有启用的数据
      dic.value = resp.result?.filter((item) => item?.status) || []
      designer.dictionary.value = dic.value
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
  if (e === 'end') {
    emits('change', {
      type: 'end',
      label: undefined,
      name: undefined,
      isSource: false,
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

const isSource = computed(() => {
  return data.type === 'end' && sourceList.value.length
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
    isSource: isSource.value,
  }
  emits('change', obj)
}

const onCommandChange = () => {
  data.source = undefined
  data.label = undefined
  data.value = undefined
  emits('change', data)
}

const onSourceChange = () => {
  data.label = undefined
  data.value = undefined
  emits('change', data)
}

const onDataChange = () => {
  emits('change', data)
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