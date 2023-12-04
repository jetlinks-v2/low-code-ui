<template>
  <div>
    <j-button type="dashed" shape="round" @click="onBtn">
      配置
    </j-button>
    <j-modal
        v-model:visible="visible"
        title="配置"
        :width="800"
        @ok="handleOk"
        @cancel="handleCancel"
    >
      <j-form layout="vertical" ref="formRef" :model="formState">
        <j-form-item label="类型" name="type" required>
          <j-radio-group v-model:value="formState.type" button-style="solid" @change="onChange">
            <j-radio-button value="static">静态数据</j-radio-button>
            <j-radio-button value="dynamic">动态数据</j-radio-button>
          </j-radio-group>
        </j-form-item>
        <j-form-item label="静态数据" name="optionsJson" required v-if="formState.type === 'static'">
          <div style="display: flex; gap: 12px">
            <div ref="target" style="height: 300px; flex: 1">
              <j-monaco-editor
                  @errorChange="onErrorChange"
                  v-model="formState.optionsJson"
                  language="json"
                  key="static"
              />
            </div>
            <div ref="target" style="height: 300px; width: 300px">
              <j-monaco-editor
                  :modelValue="defaultJson"
                  language="json"
                  :readOnly="true"
              />
            </div>
          </div>
        </j-form-item>
        <template v-if="formState.type === 'dynamic'">
          <dataSourceConfig ref="dataRef" :value="formState.optionsData"/>
        </template>
      </j-form>
    </j-modal>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive} from "vue";
import dataSourceConfig from '../DataSource/dataSourceConfig.vue'
import {onlyMessage} from "@jetlinks-web/utils";
import {cloneDeep} from "lodash-es";

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  },
});

const emits = defineEmits(["update:value", "change"]);
const visible = ref<boolean>(false);
const _error = ref<any[]>([]);

const defaultJson = `
[
  {
    "label": "数据1",
    "value": "num1"
  },
  {
    "label": "数据2",
    "value": "num2"
  },
  {
    "label": "数据3",
    "value": "num3"
  }
]
`

const onBtn = () => {
  visible.value = true;
};

const formState = reactive({
  type: 'static',
  optionsJson: '',
  optionsData: {}
});

const formRef = ref<any>();
const dataRef = ref<any>();

const onErrorChange = (error: any[]) => {
  _error.value = error;
};

const onChange = () => {
  formState.optionsJson = ''
  formState.optionsData = {}
}

const handleOk = async () => {
  if (formState.type === 'static') {
    if (!_error.value?.length) {
      const resp = await formRef.value?.validateFields()
      if (resp) {
        emits("update:value", formState);
        emits("change", formState);
        visible.value = false;
      }
    } else {
      onlyMessage("代码有误，请检查", "error");
    }
  } else {
    const res = await dataRef.value?.onSave()
    const resp = await formRef.value?.validateFields()
    if (resp && res.query) {
      const obj = {
        ...formState,
        optionsData: res
      }
      emits("update:value", obj);
      emits("change", obj);
      visible.value = false;
    } else {
      onlyMessage("请配置数据源", "error");
    }
  }
};

const handleCancel = () => {
  visible.value = false;
};

watchEffect(() => {
  Object.assign(formState, cloneDeep(props.value))
})
</script>
