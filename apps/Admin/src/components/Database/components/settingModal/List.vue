<template>

  <j-form-item label="元素类型" :name="['others', 'valueJavaType']" required>
    <j-select
      v-model:value="model.others.valueJavaType"
      :options="options"
      :fieldNames="{
        label: 'text'
      }"
    />
  </j-form-item>
  <j-form-item label="数据操作" name="spec">
    <Spec v-model:value="model.spec" />
  </j-form-item>
</template>

<script  setup name="CRUDSettingList">
import { SETTING_FORM_MODEL } from "@/components/Database/util";
import { inject } from "vue";
import { basicField } from '@/api/dictionary'
import { useRequest } from '@jetlinks/hooks'
import Spec from './Spec.vue'
import 'jetlinks-ui-components/es/CheckButton/style'

const model = inject(SETTING_FORM_MODEL, {})

const { data: options } = useRequest(basicField)

</script>

<style scoped lang="less">
.curd-setting-boolean {
  :deep(.data-table-boolean-item) {
    display: flex;
    gap: 12px;
    align-items: center;
  }
}

.curd-setting-enum {
  :deep(.enum-table-warp) {
    margin-top: 12px;

    .enum-table-add {
      margin-top: 12px;
      width: 100%;
    }
  }
}
</style>
