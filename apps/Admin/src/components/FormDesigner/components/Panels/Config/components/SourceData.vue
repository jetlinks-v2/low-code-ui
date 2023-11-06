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
      :rules="rulesDic"
    >
      <j-select
        placeholder="请选择"
        v-model:value="data.dictionary"
        showSearch
        @change="onDataChange"
      >
        <j-select-option
          :label="item.name"
          v-for="item in dic || []"
          :key="item.id"
          :value="item.id"
        >
          {{ item.name }}
        </j-select-option>
      </j-select>
    </j-form-item>
    <template v-else>
      <j-form-item
        :validateFirst="true"
        :name="['componentProps', 'source', 'projectId']"
        :rules="rulesProject"
      >
        <j-select
          v-model:value="data.projectId"
          placeholder="请选择"
          :options="projectList"
          allowClear
          showSearch
          @change="onProjectChange"
        >
        </j-select>
      </j-form-item>
      <j-row :gutter="16">
        <j-col :span="12">
          <j-form-item
            :validateFirst="true"
            :name="['componentProps', 'source', 'functionId']"
            :rules="rulesFunc"
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
            :rules="rulesComm"
            :name="['componentProps', 'source', 'commandId']"
          >
            <j-select
              v-model:value="data.commandId"
              placeholder="请选择"
              :options="commandOptions"
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
        :rules="rulesSource"
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
        :rules="rulesLabel"
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
        :rules="rulesLabel"
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
import { watch, computed, reactive, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { getArray, searchTree } from '@/components/FormDesigner/utils/utils'
import { queryDictionary, queryEndCommand, queryEndCommands, queryProject } from '@/api/form'
import { useProduct } from '@/store'

const product = useProduct()

const projectList = ref<any[]>([])
const dic = ref<any[]>([])
const end = ref<any[]>([])

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

const rulesDic = [
  {
    required: true,
    message: '请选择',
  },
  {
    validator(_rule: any, value: string) {
      const item = dic.value?.find((i) => i?.id === value)
      if (!item) {
        return Promise.reject(`数字字典已被删除或禁用`)
      }
      return Promise.resolve()
    },
    trigger: 'change',
  },
]

const rulesComm = [
  {
    required: true,
    message: '请选择',
  },
  {
    validator(_rule: any, value: string) {
      const item = commandOptions.value?.find((i) => i?.value === value)
      if (!item) {
        return Promise.reject(`数据已被删除`)
      }
      return Promise.resolve()
    },
    trigger: 'change',
  },
]

const rulesFunc = [
  {
    required: true,
    message: '请选择',
  },
  {
    validator(_rule: any, value: string) {
      const item = functionList.value?.find((i) => i?.value === value)
      if (!item) {
        return Promise.reject(`数据已被删除`)
      }
      return Promise.resolve()
    },
    trigger: 'change',
  },
]

const rulesProject = [
  {
    required: true,
    message: '请选择',
  },
  {
    validator(_rule: any, value: string) {
      const item = projectList.value?.find((i) => i?.value === value)
      if (!item) {
        return Promise.reject(`数据已被删除`)
      }
      return Promise.resolve()
    },
    trigger: 'change',
  },
]

const rulesLabel = [
  {
    required: true,
    message: '请选择',
  },
  {
    validator(_rule: any, value: string) {
      const item = labelList.value?.find((i) => i?.value === value)
      if (!item) {
        return Promise.reject(`数据已被删除`)
      }
      return Promise.resolve()
    },
    trigger: 'change',
  },
]

const rulesSource = [
  {
    required: true,
    message: '请选择',
  },
  {
    validator(_rule: any, value: string) {
      const item = sourceList.value?.find((i) => i?.value === value)
      if (!item) {
        return Promise.reject(`数据已被删除`)
      }
      return Promise.resolve()
    },
    trigger: 'change',
  },
]

const getProject = () => {
  queryProject().then((resp) => {
    if (resp.success) {
      projectList.value = resp.result.map((item) => {
        return {
          modules: item.modules || [],
          label: item.name,
          value: item.id,
        }
      })
    }
  })
}

const getDictionary = () => {
  queryDictionary().then((resp) => {
    if (resp.success) {
      // 过滤掉没有启用的数据
      dic.value = resp.result?.filter((item) => item?.status) || []
    }
  })
}

const getEnd = (id: string) => {
  if (id === product.info?.id) {
    queryEndCommand(product.info?.draftId, []).then((resp) => {
      if (resp.success) {
        end.value = resp.result || []
      }
    })
  } else {
    queryEndCommands(id, []).then((resp) => {
      if (resp.success) {
        end.value = resp.result || []
      }
    })
  }
}

const onRadioChange = (e) => {
  console.log(e, 'e')
  if (e === 'end') {
    emits('change', {
      type: 'end',
      label: undefined,
      projectId: undefined,
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
    (end.value || []).map((item) => {
      return {
        label: item.name + '.' + item.id,
        value: item.id,
      }
    }) || []
  )
})

const commandList = computed(() => {
  return (
    (end.value || [])
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

const commandOptions = computed(() => {
  return commandList.value.map((i) => {
    return {
      label: i.name,
      value: i.id,
    }
  })
})

const sourceList = computed(() => {
  const properties =
    commandList.value.find((item) => item.id === data?.commandId)?.output
      ?.properties || []
  return getArray(properties)
})

const isSource = computed(() => {
  return !!(data.type === 'end' && sourceList.value?.length)
})

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

const onProjectChange = (val: string) => {
  const obj = {
    type: 'end',
    projectId: val,
    functionId: undefined,
    fullId: undefined,
    commandId: undefined,
    source: undefined,
    label: undefined,
    value: undefined,
    isSource: isSource.value,
  }
  end.value = []
  emits('change', obj)
}

const _project = computed(() => {
  return projectList.value.find((item) => {
    return item?.value === data?.projectId
  })
})

const onFunChange = (val: string) => {
  const obj = {
    projectId: data.projectId,
    type: 'end',
    functionId: val,
    fullId: _project.value?.modules?.[0]?.functions?.find((i) => i.id === val)
      ?.fullId,
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
  data.isSource = isSource.value
  emits('change', data)
}

const onSourceChange = () => {
  data.label = undefined
  data.value = undefined
  data.isSource = isSource.value
  emits('change', data)
}

const onDataChange = () => {
  data.isSource = isSource.value
  emits('change', data)
}

watch(
  () => data?.type,
  (newVal) => {
    if (newVal === 'dic') {
      getDictionary()
    } else {
      getProject()
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => props.value,
  (newValue) => {
    const obj = newValue || {
      dictionary: undefined,
      type: 'dic',
    }
    if (obj.type === 'dic') {
      data.dictionary = obj.dictionary
      data.type = 'dic'
    } else {
      data.type = 'end'
      data.projectId = obj?.projectId
      data.functionId = obj?.functionId
      data.fullId = obj?.fullId
      data.commandId = obj?.commandId
      data.source = obj?.source
      data.label = obj?.label
      data.value = obj?.value
      data.isSource = obj?.isSource
      if (data?.projectId && !end.value?.length) {
        getEnd(data.projectId)
      }
    }
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>