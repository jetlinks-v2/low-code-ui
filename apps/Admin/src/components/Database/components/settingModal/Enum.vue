<template>
  <j-form-item label="数据字典" :name="['dictionary', 'dictionaryId']" required>
    <j-select
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
import { SETTING_FORM_MODEL } from "@/components/Database/util";
import Spec from './Spec.vue'
import { inject } from "vue";
import { useRequest } from '@jetlinks/hooks'
import { dictionaryList } from "@/api/dictionary";

const { data: options } = useRequest(dictionaryList, {
  onSuccess(res) {
    if (res) {
      return res.result.map(item => ({ ...item, label: item.name, value: item.id }))
    }
    return []
  }
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
