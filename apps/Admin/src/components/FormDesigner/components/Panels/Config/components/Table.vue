<template>
  <div>
    <template v-if="['input-number'].includes(type)">
      <j-form-item
        :validateFirst="true"
        :rules="maxRules"
        label="最大值"
        :name="['children', 0, 'componentProps', 'max']"
      >
        <j-input-number
          style="width: 100%"
          v-model:value="target.children[0].componentProps.max"
          placeholder="请输入"
          :max="99999999999999"
          @change="onChange"
        />
      </j-form-item>
      <j-form-item
        :validateFirst="true"
        :rules="minRules"
        label="最小值"
        :name="['children', 0, 'componentProps', 'min']"
      >
        <j-input-number
          style="width: 100%"
          v-model:value="target.children[0].componentProps.min"
          placeholder="请输入"
          :max="99999999999999"
          @change="onChange"
        />
      </j-form-item>
      <j-form-item
        label="精度"
        :name="['children', 0, 'componentProps', 'precision']"
        required
        :validateFirst="true"
      >
        <j-input-number
          style="width: 100%"
          v-model:value="target.children[0].componentProps.precision"
          placeholder="请输入"
          :precision="0"
          :min="0"
          :max="99999999999999"
          @change="onChange"
        />
      </j-form-item>
    </template>
    <template
      v-if="
        [
          'select-card',
          'select',
        ].includes(type)
      "
    >
      <j-form-item
        :validateFirst="true"
        label="类型"
        :name="['children', 0, 'componentProps', 'mode']"
      >
        <j-radio-group
          v-model:value="target.children[0].componentProps.mode"
          button-style="solid"
          @change="onChange"
        >
          <j-radio-button :value="undefined">单选项</j-radio-button>
          <j-radio-button :value="'multiple'">多选项</j-radio-button>
        </j-radio-group>
      </j-form-item>
    </template>
    <template v-if="['tree-select'].includes(type)">
      <j-form-item
        :validateFirst="true"
        label="类型"
        :name="['children', 0, 'componentProps', 'multiple']"
      >
        <j-radio-group
          v-model:value="target.children[0].componentProps.multiple"
          button-style="solid"
          @change="onChange"
        >
          <j-radio-button :value="false">单选项</j-radio-button>
          <j-radio-button :value="true">多选项</j-radio-button>
        </j-radio-group>
      </j-form-item>
      <j-form-item
        label="可选节点"
        v-if="target.children[0].componentProps.multiple"
        :name="['children', 0, 'componentProps', 'treeCheckStrictly']"
        :validateFirst="true"
        :rules="[
          {
            required: true,
            message: '请选择',
          },
        ]"
      >
        <j-select
          v-model:value="target.children[0].componentProps.treeCheckStrictly"
          placeholder="请选择"
          @change="onChange"
        >
          <j-select-option :value="false">联动选择</j-select-option>
          <j-select-option :value="true">仅选子节点</j-select-option>
        </j-select>
      </j-form-item>
    </template>
    <template v-if="['tree-select', 'select'].includes(type)">
      <j-form-item
        label="支持模糊搜索"
        :name="['children', 0, 'componentProps', 'showSearch']"
        :validateFirst="true"
        :rules="[
          {
            required: true,
            message: '请选择',
          },
        ]"
      >
        <j-switch
          @change="onChange"
          v-model:checked="target.children[0].componentProps.showSearch"
        />
      </j-form-item>
    </template>
    <template
      v-if="
        [
          'input',
          'textarea',
          'input-number',
          'input-password',
          'select-card',
          'switch',
          'tree-select',
          'select',
          'date-picker',
          'time-picker',
        ].includes(type)
      "
    >
      <j-form-item
        label="约束"
        :name="['children', 0, 'formItemProps', 'required']"
        :validateFirst="true"
        :rules="[
          {
            required: true,
            message: '请选择',
          },
        ]"
      >
        <j-radio-group
          v-model:value="target.children[0].formItemProps.required"
          button-style="solid"
          @change="onChange"
        >
          <j-radio-button :value="true">必填</j-radio-button>
          <j-radio-button :value="false">非必填</j-radio-button>
        </j-radio-group>
      </j-form-item>
    </template>
    <template
      v-if="
        [
          'input',
          'textarea',
          'input-number',
          'input-password',
          'tree-select',
          'select',
          'date-picker',
          'time-picker',
        ].includes(type)
      "
    >
      <j-form-item
        :validateFirst="true"
        label="占位提示"
        :name="['children', 0, 'placeholder']"
      >
        <j-input
          placeholder="请输入"
          v-model:value="target.children[0].componentProps.placeholder"
          :maxlength="32"
          @change="onChange"
        />
      </j-form-item>
    </template>
    <!-- 规则校验 -->
    <template v-if="rulesVisible">
      <j-form-item :name="['children', 0, 'formItemProps', 'rules']" :validateFirst="true">
        <Rule
          :type="type"
          v-model:value="target.children[0].formItemProps.rules"
          @change="onChange"
        />
      </j-form-item>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, unref } from 'vue'
import { useTarget } from '../../../../hooks'
import Config from './Config.vue'
import Rule from './Rules/Rule.vue'

const { target } = useTarget()

const type = computed(() => {
  return target.value.children?.[0]?.type
})

const maxRules = [
  {
    required: true,
    message: '请输入最大值',
  },
  {
    validator(_: any, value: number) {
      if (value === null || value === undefined) return Promise.resolve()
      if (value < target.value.children?.[0]?.componentProps.min)
        return Promise.reject(`最大值必须大于最小值`)
      return Promise.resolve()
    },
    trigger: 'change',
  },
]

const minRules = [
  {
    required: true,
    message: '请输入最小值',
  },
  {
    validator(_: any, value: number) {
      if (value === null || value === undefined) return Promise.resolve()
      if (value > target.value.children?.[0]?.componentProps.max)
        return Promise.reject(`最大值必须大于最小值`)
      return Promise.resolve()
    },
    trigger: 'change',
  },
]

const rulesVisible = computed(() => {
  return [
    'input',
    'textarea',
    'input-password',
    'date-picker',
    'time-picker'
  ].includes(unref(type))
})

const emits = defineEmits(['refresh'])

const onChange = () => {
  emits('refresh', target.value)
}
</script>