<template>
  <j-form-item label="数据操作" name="spec">
    <Spec v-model:value="model.spec" />
  </j-form-item>
</template>

<script setup name="CRUDSettingBoolean">
import {inject} from "vue";
import { SETTING_FORM_MODEL } from "@LowCode/components/Database/util";
import Spec from './Spec.vue'

const model = inject(SETTING_FORM_MODEL, {})

</script>

<style scoped>

</style>
