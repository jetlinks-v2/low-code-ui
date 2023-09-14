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
  <j-form-item v-if="showRegexp" label="正则表达式" :name="['validator', 'configuration', 'regexp']" :rules="rules.regexp">
    <j-input v-model:value="model.validator.configuration.regexp" :maxLength="256">
      <template #addonBefore>
        /
      </template>
      <template #addonAfter>
        /
      </template>
    </j-input>
  </j-form-item>
  <j-form-item v-if="showGroup" label="校验生效" :name="['validator', 'configuration', 'group']">
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
  <j-form-item v-if="model.validator.provider" label="校验不通过时提示语" :name="['validator', 'configuration', 'message']" :rules="rules.message">
    <j-input v-model:value="model.validator.configuration.message" />
  </j-form-item>
<!--  <j-form-item label="最大长度" :name="['validator', 'configuration', 'message']">-->
<!--    <j-input-number v-model:value="model.max" />-->
<!--  </j-form-item>-->
  <j-form-item label="数据操作" name="spec">
    <Spec v-model:value="model.spec" />
  </j-form-item>
</template>

<script  setup name="CRUDSettingString">
import { SETTING_FORM_MODEL } from "@/components/Database/util";
import {inject} from "vue";
import Spec from './Spec.vue'
import { regular } from '@jetlinks/utils'

const model = inject(SETTING_FORM_MODEL, {})

const showRegexp = computed(() => {
  return model.value.validator.provider === 'pattern'
})

const showGroup = computed(() => {
  return model.value.validator.provider
})

const rulesOptions = [
  {
    label: '非空',
    value: 'noEmpty'
  },
  {
    label: '正则表达式',
    value: 'pattern'
  },
  {
    label: '邮箱',
    value: 'email'
  },
  {
    label: '电话',
    value: 'phone'
  },
]

const rules = {
  fixValue: [
    { max: model.value.length, message: `请输入长度在${model.value.length}以内的字符`}
  ],
  regexp: [
    { required: true, message: '请输入正则表达式' },
    {
      validator(_, value) {
        try {
          if (eval(`/${value}/`) instanceof RegExp) {
            return Promise.resolve();
          } else {
            return Promise.reject('请输入正确的正则表达式, 比如：^[a-z]')
          }
        } catch (e) {
          return Promise.reject('请输入正确的正则表达式, 比如：^[a-z]')
        }
      }
    }
  ],
  message: [
    { max: 64, message: '最多输入64位字符'}
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
    case 'pattern':
      model.value.validator.configuration = {
        message: configuration.message,
        group: configuration.group,
        regexp: undefined
      }
      break;
    case 'email':
      model.value.validator.configuration = {
        message: configuration.message,
        group: configuration.group,
        regexp: regular.emailReg
      }
      break;
    case 'phone':
      model.value.validator.configuration = {
        message: configuration.message,
        group: configuration.group,
        regexp: regular.cellphoneReg
      }
      break;
  }
}

</script>

<style scoped>

</style>
