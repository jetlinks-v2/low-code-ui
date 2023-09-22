<template>
  <j-form-item label="key" :name="['others', 'keyJavaType']" required :rules="[{ required: true, message: '请选择key'}]">
    <j-select
      :options="[
        {
          label: 'String',
          value: 'string'
        },
        {
          label: 'Integer',
          value: 'Integer'
        },
      ]"
      v-model:value="model.others.keyJavaType"
    />
  </j-form-item>
  <j-form-item label="value" :name="['others', 'valueJavaType']" required :rules="[{ required: true, message: '请选择value'}]">
    <j-select
      :options="options"
      :fieldNames="{
        label: 'text'
      }"
      v-model:value="model.others.valueJavaType"
    />
  </j-form-item>
  <j-form-item label="数据操作" name="spec">
    <Spec v-model:value="model.spec" />
  </j-form-item>
</template>

<script  setup name="CRUDSettingMap">
import { SETTING_FORM_MODEL } from "@/components/Database/util";
import { inject } from "vue";
import Spec from './Spec.vue'
import { basicField } from '@/api/dictionary'
import { useRequest } from '@jetlinks/hooks'

const { data: options } = useRequest(basicField)

const model = inject(SETTING_FORM_MODEL, {})

</script>

<style scoped>

</style>
