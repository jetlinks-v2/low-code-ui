<template>
  <j-form-item label="key" :name="['others', 'keyJavaType']">
    <j-select
        allowClear
        :options="[
        {
          label: 'String',
          value: 'String'
        },
        {
          label: 'Integer',
          value: 'Integer'
        },
      ]"
        v-model:value="model.others.keyJavaType"
    />
  </j-form-item>
  <j-form-item label="value" :name="['others', 'valueJavaType']">
    <j-select
        allowClear
        :options="options"
        :fieldNames="{
        label: 'text'
      }"
        v-model:value="model.others.valueJavaType"
    />
  </j-form-item>
  <j-form-item label="数据操作" name="spec">
    <Spec v-model:value="model.spec"/>
  </j-form-item>
</template>

<script setup name="CRUDSettingMap">
import {SETTING_FORM_MODEL} from "@LowCode/components/Database/util";
import {inject} from "vue";
import Spec from './Spec.vue'
import {basicField} from '@LowCode/api/dictionary'
import {useRequest} from '@jetlinks-web/hooks'

const {data: options} = useRequest(basicField)

const model = inject(SETTING_FORM_MODEL, {})

</script>

<style scoped>

</style>
