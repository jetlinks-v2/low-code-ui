<template>
  <j-form-item label="数据字典" :name="['dictionary', 'dictionaryId']" required :rules="[{ required: true, message: '请选择数据字典'}]">
    <j-select
      showSearch
      :options="options"
      placeholder="请选择数据字典"
      v-model:value="model.dictionary.dictionaryId"
    />
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
import { dictionaryList } from "@LowCode/api/dictionary";

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
  defaultParams: [{ sorts: [ { name: 'createTime', order: 'desc'},{ name: 'name', order: 'desc'} ]}]
})

const model = inject(SETTING_FORM_MODEL, {})
const visible = ref(false)
const change = (key) => {
  console.log(model.value)
  if (key && model.value.jdbcType !== 'BIGINT') {
    visible.value = true
  }
}

const save = () => {
  model.value.jdbcType = 'BIGINT'
  visible.value = false
}

</script>

<style scoped>

</style>
