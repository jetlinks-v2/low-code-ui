<template>
  <j-form-item label="数据字典" :name="['dictionary', 'dictionaryId']" required :rules="[{ required: true, message: '请选择数据字典'}]">
    <j-select
      showSearch
      :options="options"
      placeholder="请选择数据字典"
      v-model:value="model.dictionary.dictionaryId"
    />
  </j-form-item>
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
  <j-form-item
      v-if="mySpecType === 'fixValue'"
      label="固定值"
      name="fixValue"
      required
      :rules="[{ required: true, message: '请选择固定值'}]"
  >
    <j-select placeholder="请选择固定值" v-model:value="model.fixValue" :options="enumValueOptions" />
  </j-form-item>
  <j-form-item label="约束" :name="['dictionary', 'multiple']">
    <BooleanSelect
      falseText="单选"
      trueText="多选"
      v-model:value="model.dictionary.multiple"
      :disabled="publish"
      @change="change"
    />
  </j-form-item>
  <j-form-item label="数据操作" name="spec">
    <Spec v-model:value="model.spec" />
  </j-form-item>
  <j-modal
    :visible="visible"
    okText="修改为BIGINT类型"
    cancelText="忽略"
    :centered="true"
    :zIndex="1040"
    :getContainer="warp"
    :maskStyle="{opacity: 0}"
    @ok="save"
    @cancel="visible = false"
  >
    <div>
      当前jdbcType类型为{{model.jdbcType}}
    </div>
    <div>
      建议修改为BIGINT类型
    </div>
  </j-modal>
</template>

<script setup name="CRUDSettingEnum">
import { SETTING_FORM_MODEL } from "@LowCode/components/Database/util";
import Spec from './Spec.vue'
import { inject } from "vue";
import { useRequest } from '@jetlinks-web/hooks'
import {dictionaryItemList, dictionaryList} from "@LowCode/api/dictionary";
import { BooleanSelect } from '@LowCode/components/index'
import {addItem, ruleValidator } from './ID/util'
import IDConfig from './ID/config.vue'
import TypeSelect from "./ID/typeSelect.vue";

const props = defineProps({
  warp: {
    type: Object
  },
  publish: {
    type: Boolean
  }
})

const { data: options } = useRequest(dictionaryList, {
  onSuccess(res) {
    if (res) {
      return res.result.map(item => ({ ...item, label: item.name, value: item.id }))
    }
    return []
  },
  defaultParams: [{ sorts: [ { name: 'createTime', order: 'desc'},{ name: 'name', order: 'desc'} ], terms:[{ column: 'status', value: 1 }]}]
})

const { data: enumValueOptions, run } = useRequest(dictionaryItemList, {
  onSuccess(res) {
    if (res) {
      return res.result.map(item => ({ ...item, label: item.text, }))
    }
    return []
  },
  immediate: false
})

const model = inject(SETTING_FORM_MODEL, {})
const visible = ref(false)

const mySpecType = ref('no')

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

const change = (key) => {
  if (key && model.value.jdbcType !== 'BIGINT') {
    visible.value = true
  }
}

const save = () => {
  model.value.jdbcType = 'BIGINT'
  visible.value = false
}

watch(() => model.value.dictionary.dictionaryId, (val) => {
  run({
    paging: false,
    sorts: [{ name: 'ordinal', order: 'desc' }],
    terms: [{ column: 'dictId', value: val }]
  })
}, { immediate: true })

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
