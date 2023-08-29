<template>
  <j-form-item label="默认值" :name="['defaultValueSpec', 'fixValue']" :rules="rules.fixValue">
    <j-input v-model:value="model.defaultValueSpec.fixValue" placeholder="请输入默认值" :maxLength="256" />
  </j-form-item>
  <j-form-item label="校验规则" :name="['validator', 'provider']">
    <j-select
      allowClear
      :options="rulesOptions"
      v-model:value="model.validator.provider"
      @change="providerChange"
    />
  </j-form-item>
  <j-form-item v-if="model.validator.provider" label="校验生效" :name="['validator', 'configuration', 'group']">
    <j-card-select
      :options="[
        {
          label: '新增/保存',
          value: 'add'
        },
        {
          label: '修改',
          value: 'update'
        }
      ]"
      :column="2"
      :showImage="false"
      :multiple="true"
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
    <div style="padding-bottom: 8px;">范围</div>
    <div class="setting-range">
      <j-form-item style="flex: 1" :rules="rules.min" :name="['validator', 'configuration', 'min']">
        <j-input-number v-model:value="model.validator.configuration.min" style="width: 100%;" />
      </j-form-item>
      <div style="margin-top: 4px">-</div>
      <j-form-item style="flex: 1" :rules="rules.max" :name="['validator', 'configuration', 'max']">
        <j-input-number v-model:value="model.validator.configuration.max" style="width: 100%;" />
      </j-form-item>
    </div>
  </template>
  <j-form-item
    v-if="model.validator.provider === 'max'"
    label="最大值"
    :name="['validator', 'configuration', 'value']"
    :rules="model.javaType === 'Int' ? [intMax] : undefined"
  >
    <j-input-number v-model:value="model.validator.configuration.value" style="width: 100%;" />
  </j-form-item>
  <j-form-item
    v-if="model.validator.provider === 'min'"
    label="最小值"
    :name="['validator', 'configuration', 'value']"
    :rules="model.javaType === 'Int' ? [intMin] : undefined"
  >
    <j-input-number v-model:value="model.validator.configuration.value" style="width: 100%;" />
  </j-form-item>
  <j-form-item label="数据操作" name="spec">
    <Spec v-model:value="model.spec" />
  </j-form-item>
</template>

<script setup name="CRUDSettingNumber">
import { SETTING_FORM_MODEL, SETTING_FORM_REF } from "@/components/Database/util";
import {inject} from "vue";
import Spec from './Spec.vue'

const model = inject(SETTING_FORM_MODEL)
const formRef = inject(SETTING_FORM_REF)

const rulesOptions = [
  {
    label: '非空',
    value: 'noEmpty'
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

const intMax = {
  validator(_, value) {
    if (model.value.javaType === 'Int' && value > 2147483647) {
      return Promise.reject('最大值不能大于2147483647')
    }
    return Promise.resolve()
  }
}

const intMin = {
  validator(_, value) {
    if (model.value.javaType === 'Int' && value < -2147483647) {
      return Promise.reject('最小值不能小于-2147483647')
    }
    return Promise.resolve()
  }
}

const rules = {
  fixValue: [
    { max: model.value.length, message: `请输入长度在${model.value.length}以内的字符`}
  ],
  message: [
    { max: 64, message: '最多输入64位字符'}
  ],
  min: [
    {
      async validator(_, value) {
        console.log('min',value, model.value);
        if (model.value.javaType === 'Int' && value < -2147483647) {
          return Promise.reject('最小值不能小于-2147483647')
        }
        if (value > model.value.validator.configuration.max) {
          return Promise.reject('最小值不能大于最大值')
        }
        return Promise.resolve()
      }
    }
  ],
  max: [
    {
      async validator(_, value) {
        formRef.value.validateFields([['validator', 'configuration', 'min']])

        if (model.value.javaType === 'Int' && value > 2147483647) {
          return Promise.reject('最大值不能大于2147483647')
        }
        return Promise.resolve()
      }
    }
  ]
}

const providerChange = (key) => {
  const configuration = model.value.validator.configuration
  switch (key) {
    case 'noEmpty':
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
    case 'main':
      model.value.validator.configuration = {
        message: configuration.message,
        group: configuration.group,
        value: undefined,
        classType: model.value.javaType
      }
      break;
  }
}

</script>

<style scoped>
.setting-range {
  display: flex;
  gap: 12px;

}
</style>
