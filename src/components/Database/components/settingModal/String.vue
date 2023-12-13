 <template>
   <j-form-item
       label="配置默认值"
       required
       :rules="[{ required: true, message: '请选择生成编码'}]"
   >
     <TypeSelect
         v-model:value="mySpecType"
         :options="[
                  { label: '不提供', value: 'no'},
                  { label: '固定值', value: 'fixValue'},
                  { label: '动态值', value: 'rule'},
              ]"
         @change="specChange"
     />
   </j-form-item>
   <j-form-item
       v-if="mySpecType === 'rule'"
       label="规则配置"
       name="conditionData"
       required
       :rules="[{ validator: validator }]"
   >
     <IDConfig
         v-model:value="model.conditionData"
         :id="model?.name"
     />
   </j-form-item>
  <j-form-item v-if="mySpecType === 'fixValue'" label="默认值" name="fixValue" :rules="rules.fixValue">
    <j-input v-model:value="model.fixValue" placeholder="请输入默认值" />
  </j-form-item>
  <j-form-item label="校验规则" :name="['validator', 'provider']">
    <SelectNull
      :options="rulesOptions"
      v-model:value="model.validator.providerType"
      @change="providerChange"
    />
  </j-form-item>
  <j-form-item v-if="showRegexp" label="正则表达式" :name="['validator', 'configuration', 'regexp']" :rules="rules.regexp" :validateFirst="true">
    <j-input v-model:value="model.validator.configuration.regexp" :maxLength="256">
      <template #addonBefore>
        /
      </template>
      <template #addonAfter>
        /
      </template>
    </j-input>
  </j-form-item>
  <j-form-item v-if="showGroup" label="校验生效" :name="['validator', 'configuration', 'group']" :rules="rules.group">
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
  <j-form-item v-if="model.validator.providerType" label="校验不通过时提示语" :name="['validator', 'configuration', 'message']" :rules="rules.message">
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
import { SETTING_FORM_MODEL } from "@LowCode/components/Database/util";
import {inject} from "vue";
import Spec from './Spec.vue'
import SelectNull from './SelectNull.vue'
import {addItem, ruleValidator } from './ID/util'
import IDConfig from './ID/config.vue'
import TypeSelect from "./ID/typeSelect.vue";

const model = inject(SETTING_FORM_MODEL, {})

const mySpecType = ref('no')

const showRegexp = computed(() => {
  return model.value.validator.providerType === 'pattern'
})

const showGroup = computed(() => {
  return model.value.validator.providerType
})

const rulesOptions = [
  {
    label: '非空',
    value: 'notEmpty'
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

const validator = (_, val) => {
  return ruleValidator(val)
}

const specChange = (key) => {
  model.value.defaultValueSpec = undefined
  model.value.fixValue = undefined

  if (key === 'rule') {
    const item = addItem()
    model.value.conditionData = [item]
  } else {
    model.value.conditionData = undefined
  }

  mySpecType.value = key
}
const groupChange = (v) => {
  const groupSet = new Set(v)
  if (groupSet.has('insert')) {
    groupSet.add('save')
  } else {
    groupSet.delete('save')
  }
  model.value.validator.configuration.group = [...groupSet.values()]
}

const rules = {
  fixValue: [
    { max: model.value.length ?? 256, message: `请输入长度在${model.value.length ?? 256}以内的字符`}
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
    { required: true, message: '请输入校验不通过时提示语' },
    { max: 64, message: '最多输入64位字符'}
  ],
  group: [
    { required: true, message: '请选择校验生效' },
  ]
}

const providerChange = (key) => {
  const configuration = model.value.validator.configuration
  const _group = configuration.group || ['save', 'update', 'insert']
  const message = configuration.message || '数据格式错误'

  if (['email', 'phone'].includes(key)) {
    model.value.validator.provider = 'pattern'
  } else {
    model.value.validator.provider = key
  }

  switch (key) {
    case 'notEmpty':
      model.value.validator.configuration = {
        message: message,
        group: _group
      }
      break;
    case 'pattern':
      model.value.validator.configuration = {
        message: message,
        group: _group,
        regexp: undefined
      }
      break;
    case 'email':
      model.value.validator.configuration = {
        message: message,
        group: _group,
        regexp: `^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$`
      }
      break;
    case 'phone':
      model.value.validator.configuration = {
        message: message,
        group: _group,
        regexp: `^(((\\+86)|(\\+86-))|((86)|(86\\-))|((0086)|(0086\\-)))?1[3|5|7|8|9]\\d{9}$`
      }
      break;
    default:
      model.value.validator.configuration = { }
      break
  }
}

watch([model.value.conditionData, model.value.fixValue], () => {
  if (model.value.conditionData) {
    mySpecType.value = 'rule'
  } else if (model.value.fixValue) {
    mySpecType.value = 'fixValue'
  } else {
    mySpecType.value = 'no'
  }
}, { immediate: true })

</script>

<style scoped>

</style>
