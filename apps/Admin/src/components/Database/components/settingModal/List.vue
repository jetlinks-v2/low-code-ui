<template>

  <j-form-item label="元素类型" name="type">
    <j-select
      v-model:value="model.type"
      :options="options"
      :fieldNames="{
        label: 'text'
      }"
      @change="typeChange"
    />
  </j-form-item>
  <ScaleItem
    v-if="['float', 'double'].includes(model.type)"
    v-model:value="model.scale"
  />
  <StringItem
    v-else-if="model.type === 'string'"
    v-model:value="model.maxLength"
  />
  <div v-else-if="model.type === 'boolean'" class="curd-setting-boolean">
    <BooleanItem
      v-model:value="model.boolean"
      name="boolean"
    />
  </div>
  <DateItem
    v-else-if="model.type === 'date'"
    v-model:value="model.format"
  />
  <div v-else-if="model.type === 'enum'" class="curd-setting-enum">
    <EnumItem
      ref="enumRef"
      v-model:value="model.enum.elements"
      v-model:type="model.enum.multiple"
      :name="['enum', 'elements']"
      :multiple="true"
    />
  </div>
  <j-form-item label="数据操作" name="spec">
    <Spec v-model:value="model.spec" />
  </j-form-item>
</template>

<script  setup name="CRUDSettingList">
import { SETTING_FORM_MODEL } from "@/components/Database/util";
import { DateItem } from 'jetlinks-ui-components/es/DataTable/components/Date'
import { ScaleItem } from 'jetlinks-ui-components/es/DataTable/components/Double'
import { StringItem } from 'jetlinks-ui-components/es/DataTable/components/String'
import { EnumItem } from 'jetlinks-ui-components/es/DataTable/components/Enum'
import { BooleanItem } from 'jetlinks-ui-components/es/DataTable/components/Boolean'
import { inject } from "vue";
import { basicField } from '@/api/dictionary'
import { useRequest } from '@jetlinks/hooks'
import Spec from './Spec.vue'
import 'jetlinks-ui-components/es/CheckButton/style'

const model = inject(SETTING_FORM_MODEL, {})

const { data: options } = useRequest(basicField)

const typeChange = (key) => {
  switch (key) {
    case 'index':
    case 'array':
    case 'object':
      Object.assign(model, {
        type: key,
        spec: model.spec
      })
      break;
    case 'float':
    case 'double':
      Object.assign(model, {
        type: key,
        scale: 2,
        spec: model.spec
      })
      break;
    case 'string':
      Object.assign(model, {
        type: key,
        maxLength: undefined,
        spec: model.spec
      })
      break;
    case 'date':
      Object.assign(model, {
        type: key,
        format: undefined,
        spec: model.spec
      })
      break;
    case 'enum':
      Object.assign(model, {
        type: key,
        enum: {
          multiple: false,
          elements: []
        },
        spec: model.spec
      })
      break;
    case 'boolean':
      Object.assign(model, {
        type: key,
        boolean: {
          trueText: '是',
          trueValue: 'true',
          falseText: '否',
          falseValue: 'false',
        },
        spec: model.spec
      })
      break;
  }
}
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
