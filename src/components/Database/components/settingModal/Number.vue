<template>
  <j-form-item label="默认值" :name="['defaultValueSpec', 'fixValue']" :rules="rules.fixValue">
    <j-input v-model:value="model.defaultValueSpec.fixValue" placeholder="请输入默认值" :maxLength="256" />
  </j-form-item>
  <j-form-item label="校验规则" :name="['validator', 'provider']">
    <SelectNull
      :options="rulesOptions"
      v-model:value="model.validator.provider"
      @change="providerChange"
    />
  </j-form-item>
  <j-form-item v-if="model.validator.provider" label="校验生效" :name="['validator', 'configuration', 'group']" :rules="[{ required: true, message: '请选择校验生效'}]">
    <j-card-select
      :options="[
        {
          label: '新增/保存',
          value: 'insert'
        },
        {
          label: '修改',
          value: 'update'
        }
      ]"
      :column="2"
      :showImage="false"
      :multiple="true"
      @change="groupChange"
      v-model:value="model.validator.configuration.group"
    />
  </j-form-item>
  <j-form-item
    v-if="model.validator.provider"
    label="校验不通过时提示语"
    :name="['validator', 'configuration', 'message']"
    :rules="rules.message"
  >
    <j-input v-model:value="model.validator.configuration.message" />
  </j-form-item>
  <template v-if="model.validator.provider === 'range'">
    <div style="padding-bottom: 8px;">范围 <span style="color: #ff4d4f">*</span></div>
    <div class="setting-range">
      <j-form-item style="flex: 1" :rules="rules.min" :name="['validator', 'configuration', 'min']">
        <j-input-number v-model:value="model.validator.configuration.min" :stringMode="openStringMode" :precision="precision" style="width: 100%;" />
      </j-form-item>
      <div style="margin-top: 4px">-</div>
      <j-form-item style="flex: 1" :rules="rules.max" :name="['validator', 'configuration', 'max']">
        <j-input-number v-model:value="model.validator.configuration.max" :stringMode="openStringMode" :precision="precision" style="width: 100%;" />
      </j-form-item>
    </div>
  </template>
  <j-form-item
    v-if="model.validator.provider === 'max'"
    label="最大值"
    :name="['validator', 'configuration', 'value']"
    :validateFirst="true"
    :rules="model.javaType === 'Integer' ? [intMax, { required: true, message: '请输入最大值'}] : [{ required: true, message: '请输入最大值'}]"
  >
    <j-input-number v-model:value="model.validator.configuration.value" :stringMode="openStringMode" :precision="precision" style="width: 100%;" />
  </j-form-item>
  <j-form-item
    v-if="model.validator.provider === 'min'"
    label="最小值"
    :name="['validator', 'configuration', 'value']"
    :validateFirst="true"
    :rules="model.javaType === 'Integer' ? [intMin, { required: true, message: '请输入最小值'}] : [{ required: true, message: '请输入最小值'}]"
  >
    <j-input-number v-model:value="model.validator.configuration.value" :stringMode="openStringMode" :precision="precision" style="width: 100%;" />
  </j-form-item>
  <j-form-item label="数据操作" name="spec">
    <Spec v-model:value="model.spec" />
  </j-form-item>
</template>

<script setup name="CRUDSettingNumber">
import { SETTING_FORM_MODEL, SETTING_FORM_REF } from "@LowCode/components/Database/util";
import {inject} from "vue";
import Spec from './Spec.vue'
import SelectNull from './SelectNull.vue'

const model = inject(SETTING_FORM_MODEL)
const formRef = inject(SETTING_FORM_REF)

const rulesOptions = [
  {
    label: '非空',
    value: 'notEmpty'
  },
  {
    label: '范围',
    value: 'range'
  },
  {
    label: '最大值',
    value: 'max'
  },
  {
    label: '最小值',
    value: 'min'
  },
]

const precision = computed(() => {
  return model.value.javaType === 'Integer' ? 0 : undefined
})

const openStringMode = computed(() => {
  return ['Float','Double'].includes(model.value.javaType)
})

const groupChange = (v) => {
  const groupSet = new Set(v)
  if (groupSet.has('insert')) {
    groupSet.add('save')
  } else {
    groupSet.delete('save')
  }
  model.value.validator.configuration.group = [...groupSet.values()]
}

const InterMinMax = (value) => {
  return value > 2147483647 || value < -2147483648
}

const InterValidatorFn = (value) => {
  if (value > 2147483647) {
    return Promise.reject('不能大于2147483647')
  } else if (value < -2147483648) {
    return Promise.reject('不能小于-2147483648')
  }
  return Promise.resolve()
}

const intMax = {
  validator(_, value) {
    if (model.value.javaType === 'Integer') {
      return InterValidatorFn(value)
    }
    return Promise.resolve()
  }
}

const intMin = {
  validator(_, value) {
    if (model.value.javaType === 'Integer') {
      return InterValidatorFn(value)
    }
    return Promise.resolve()
  }
}

const rules = {
  fixValue: [
    { max: model.value.length, message: `请输入长度在${model.value.length}以内的字符`}
  ],
  message: [
    { required: true, message: '请输入校验不通过时提示语' },
    { max: 64, message: '最多输入64位字符'}
  ],
  min: [
    {
      async validator(_, value) {
        if (!value) {
          return Promise.reject('请输入最小值')
        }
        if (model.value.javaType === 'Integer' && InterMinMax(value)) {
          return InterValidatorFn(value)
        }
        if (value && model.value.validator.configuration.max && (BigInt(value) >= BigInt(model.value.validator.configuration.max))) {
          return Promise.reject('最小值不能大于等于最大值')
        }
        return Promise.resolve()
      }
    }
  ],
  max: [
    {
      async validator(_, value) {
        if (!value) {
          return Promise.reject('请输入最大值')
        }

        formRef.value.validateFields([['validator', 'configuration', 'min']])

        if (model.value.javaType === 'Integer') {
          return InterValidatorFn(value)
        }
        return Promise.resolve()
      }
    }
  ]
}

const providerChange = (key) => {
  const configuration = model.value.validator.configuration
  switch (key) {
    case 'notEmpty':
      model.value.validator.configuration = {
        message: configuration.message,
        group: configuration.group
      }
      break;
    case 'range':
      model.value.validator.configuration = {
        message: configuration.message,
        group: configuration.group,
        min: undefined,
        max: undefined,
        classType: model.value.javaType
      }
      break;
    case 'max':
    case 'min':
      model.value.validator.configuration = {
        message: configuration.message,
        group: configuration.group,
        value: undefined,
        classType: model.value.javaType
      }
      break;
    default:
      model.value.validator.configuration = {
        regexp: undefined,
        min: undefined,
        max: undefined,
        message: '数据格式错误',
        group: ['save', 'update', 'insert'],
        classType: model.value.javaType
      }
      break
  }
}

</script>

<style scoped>
.setting-range {
  display: flex;
  gap: 12px;

}
</style>
