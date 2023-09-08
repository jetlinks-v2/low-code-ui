<template>
  <div>
    <p>请配置可选项的数据来源</p>
    <j-form-item :name="['componentProps', 'source', 'type']">
      <j-radio-group
        v-model:value="target.componentProps.source.type"
        button-style="solid"
        @change="onRadioChange"
      >
        <j-radio-button :value="'dic'">数据字典</j-radio-button>
        <j-radio-button :value="'end'">后端接口</j-radio-button>
      </j-radio-group>
    </j-form-item>
    <j-form-item :name="['componentProps', 'source', 'dictionary']" v-if="target.componentProps?.source?.type === 'dic'">
      <j-select
        placeholder="请选择"
        v-model:value="target.componentProps.source.dictionary"
        @change="onDataChange"
      >
        <j-select-option v-for="item in dic" :key="item.id" :value="item.id">
          {{ item.name }}
        </j-select-option>
      </j-select>
    </j-form-item>
    <j-form-item v-else :name="['componentProps', 'source', 'commandId']">
      <j-row :gutter="16">
        <j-col :span="12">
          <j-select
            v-model:value="target.componentProps.source.functionId"
            placeholder="请选择"
            :options="functionList"
            allowClear
            @change="onFunChange"
          >
          </j-select>
        </j-col>
        <j-col :span="12">
          <j-select
            v-model:value="target.componentProps.source.commandId"
            placeholder="请选择"
            :options="commandList"
            allowClear
            @change="onCommandChange"
          ></j-select>
        </j-col>
      </j-row>
    </j-form-item>
    <template v-if="target.componentProps?.source?.type === 'end'">
      <j-form-item :name="['componentProps', 'source', 'source']">
        <template #label>
          数据层级<j-tooltip title="选择树结构的数据在接口的哪一层">
            <AIcon type="QuestionCircleOutlined" />
          </j-tooltip>
        </template>
        <j-tree-select
          v-model:value="target.componentProps.source.source"
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
        :rules="[
          {
            required: true,
            message: '请输入',
          },
        ]"
        :name="['componentProps', 'source', 'label']"
      >
        <template #label>
          展示字段<j-tooltip title="选择树结构进行展示的数据">
            <AIcon type="QuestionCircleOutlined" />
          </j-tooltip>
        </template>
        <j-select
          v-model:value="target.componentProps.source.label"
          placeholder="请选择"
          :options="labelList"
          allowClear
          @change="onDataChange"
        >
        </j-select>
      </j-form-item>
      <j-form-item
        :rules="[
          {
            required: true,
            message: '请输入',
          },
        ]"
        :name="['componentProps', 'source', 'value']"
      >
        <template #label>
          存入后端字段<j-tooltip title="选择树结构存入后端的数据">
            <AIcon type="QuestionCircleOutlined" />
          </j-tooltip>
        </template>
        <j-select
          v-model:value="target.componentProps.source.value"
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
import { ref, watch, computed } from 'vue'
import { useTarget } from '../../../../hooks'
import { queryDictionary, queryEndCommands } from '@/api/form'
import { useProduct } from '@/store'
import { omit } from 'lodash-es'

const product = useProduct()

const emits = defineEmits(['refresh'])

const { target } = useTarget()

const dic = ref<any[]>([])
const end = ref<any[]>([])

const getDictionary = () => {
  queryDictionary().then((resp) => {
    if (resp.success) {
      dic.value = resp.result || []
    }
  })
}

const getEnd = () => {
  const id = product.info?.draftId
  queryEndCommands(id, ["rdb-crud"]).then((resp) => {
    if (resp.success) {
      end.value = resp.result || []
    }
  })
}

const onRadioChange = (e) => {
  if (e.target?.value === 'end') {
    target.value.componentProps.source = {
      type: 'end',
      label: undefined,
      name: undefined,
      functionId: undefined,
      commandId: undefined,
      source: undefined,
    }
  } else {
    target.value.componentProps.source = {
      dictionary: undefined,
      type: 'dic',
    }
  }
  emits('refresh', target.value)
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
      .find(
        (item) => target.value.componentProps?.source?.functionId === item.id,
      )
      ?.command.map((i) => {
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
    return arr.map((item) => {
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
    commandList.value.find(
      (item) => item.id === target.value?.componentProps?.source?.commandId,
    )?.output?.properties || []
  return getArray(properties)
})

const searchTree = (arr: any[], _item: any) => {
  let _data: any = undefined
  arr.map((item) => {
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
  const _item = target.value?.componentProps?.source?.source
  if (_item) {
    const _data = searchTree(sourceList.value, _item)
    if (_data?.valueType?.type === 'array') {
      return _data.valueType?.elementType?.properties.map((item) => {
        return {
          label: item.name,
          value: item.id,
        }
      })
    }
  } else {
    return commandList.value
      .find(
        (item) => item.id === target.value?.componentProps?.source?.commandId,
      )
      ?.output?.properties.map((item) => {
        return {
          label: item.name,
          value: item.id,
        }
      })
  }
})

const onFunChange = () => {
  target.value.componentProps.source.commandId = undefined
  target.value.componentProps.source.source = undefined
  target.value.componentProps.source.label = undefined
  target.value.componentProps.source.value = undefined
  emits('refresh', target.value)
}

const onCommandChange = () => {
  target.value.componentProps.source.source = undefined
  target.value.componentProps.source.label = undefined
  target.value.componentProps.source.value = undefined
  emits('refresh', target.value)
}

const onSourceChange = () => {
  target.value.componentProps.source.label = undefined
  target.value.componentProps.source.value = undefined
  emits('refresh', target.value)
}

const onDataChange = () => {
  emits('refresh', target.value)
}

watch(
  () => target.value?.componentProps?.source?.type,
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