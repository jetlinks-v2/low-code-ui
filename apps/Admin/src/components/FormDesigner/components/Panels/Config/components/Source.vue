<template>
  <div>
    <p>请配置可选项的数据来源</p>
    <j-form-item>
      <j-radio-group
        v-model:value="target.componentProps.source.type"
        button-style="solid"
        @change="onRadioChange"
      >
        <j-radio-button :value="'dic'">数据字典</j-radio-button>
        <j-radio-button :value="'end'">后端接口</j-radio-button>
      </j-radio-group>
    </j-form-item>
    <j-form-item v-if="target.componentProps?.source?.type === 'dic'">
      <j-select
        placeholder="请选择"
        v-model:value="target.componentProps.source.dictionary"
      >
        <j-select-option v-for="item in dic" :key="item.id" :value="item.id">{{
          item.name
        }}</j-select-option>
      </j-select>
    </j-form-item>
    <j-form-item v-else>
      <j-row :gutter="16">
        <j-col :span="12">
          <j-select placeholder="请选择后端能力"></j-select>
        </j-col>
        <j-col :span="12">
          <j-select placeholder="请选择指令"></j-select>
        </j-col>
      </j-row>
    </j-form-item>
    <template v-if="target.componentProps?.source?.type === 'end'">
      <j-form-item
        :rules="[
          {
            required: true,
            message: '请输入',
          },
        ]"
      >
        <template #label>
          数据层级<j-tooltip title="选择树结构的数据在接口的哪一层">
            <AIcon type="QuestionCircleOutlined" />
          </j-tooltip>
        </template>
        <j-select placeholder="请选择" />
      </j-form-item>
      <j-form-item
        :rules="[
          {
            required: true,
            message: '请输入',
          },
        ]"
      >
        <template #label>
          展示字段<j-tooltip title="选择树结构进行展示的数据">
            <AIcon type="QuestionCircleOutlined" />
          </j-tooltip>
        </template>
        <j-select placeholder="请选择" />
      </j-form-item>
      <j-form-item
        :rules="[
          {
            required: true,
            message: '请输入',
          },
        ]"
      >
        <template #label>
          存入后端字段<j-tooltip title="选择树结构存入后端的数据">
            <AIcon type="QuestionCircleOutlined" />
          </j-tooltip>
        </template>
        <j-select placeholder="请选择" />
      </j-form-item>
    </template>
  </div>
</template>
    
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useTarget } from '../../../../hooks'
import { queryDictionary } from '@/api/form'

const { target } = useTarget()

const dic = ref<any[]>([])

const getDictionary = () => {
  queryDictionary().then((resp) => {
    if (resp.success) {
      dic.value = resp.result || []
    }
  })
}

onMounted(() => {
  getDictionary()
})

const onRadioChange = (e) => {
  if (e.target?.value === 'end') {
    target.value.componentProps.source = {
      type: 'end',
      label: undefined,
      name: undefined,
      functionId: undefined,
      commandId: undefined,
      source: undefined
    }
  } else {
    target.value.componentProps.source = {
      dictionary: undefined,
      type: 'dic',
    }
  }
}
</script>