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
          <ProMonaco :tipCode="defaultJson" v-model:value="formState.optionsJson" language="json" style="height: 300px"/>
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
import {ProMonaco} from "../ProMonaco";

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  },
});

const emits = defineEmits(["update:value", "change"]);
const visible = ref<boolean>(false);

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

const onChange = () => {
  formState.optionsJson = ''
  formState.optionsData = {}
}

const handleOk = async () => {
  if (formState.type === 'static') {
    const resp = await formRef.value?.validate()
    if (resp) {
      emits("update:value", formState);
      emits("change", formState);
      visible.value = false;
    }
  } else {
    const res = await dataRef.value?.onSave()
    const resp = await formRef.value?.validate()
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
