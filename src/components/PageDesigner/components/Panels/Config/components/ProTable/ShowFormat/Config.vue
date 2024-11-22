<template>
  <j-modal visible title="配置展示格式" @ok="onSave" @cancel="emits('close')">
    <div class="box">
      <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
        <j-form-item label="数据展示方式" name="model" required>
          <j-checkbox-group
            :value="modelRef.model"
            :options="[
              { label: '数据列表', value: 'TABLE' },
              { label: '卡片列表', value: 'CARD' },
            ]"
            @change="onChange"
          />
        </j-form-item>
        <j-form-item
            required
            label="卡片配置"
            name="cardConfig"
            v-if="modelRef.model?.includes('CARD')"
            :rules="_rules"
        >
          <CardConfig v-model:value="modelRef.cardConfig" />
        </j-form-item>
        <j-form-item
          label="默认形态"
          name="defaultModel"
          v-if="modelRef.model?.length === 2"
        >
          <j-radio-group
            v-model:value="modelRef.modelValue"
            button-style="solid"
          >
            <j-radio-button value="TABLE">数据列表</j-radio-button>
            <j-radio-button value="CARD">卡片列表</j-radio-button>
          </j-radio-group>
        </j-form-item>
      </j-form>
    </div>
  </j-modal>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import CardConfig from "./CardConfig.vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

const emits = defineEmits(["save", "close"]);

const formRef = ref();

const modelRef = reactive({
  model: ["TABLE"],
  modelValue: "",
  cardConfig: {},
});

watch(
  () => props.data,
  () => {
    modelRef.model = props.data?.model || ["TABLE"]
    modelRef.modelValue = props.data?.modelValue
    modelRef.cardConfig = props.data?.cardConfig
  },
  {
    deep: true,
    immediate: true
  }
);

const onChange = (checkedValue: any) => {
  modelRef.model = checkedValue?.length ? checkedValue : ["TABLE"];
  if(modelRef.model?.length === 2){
    modelRef.modelValue = "TABLE"
    modelRef.cardConfig = {}
  }
};

const _rules = [
  {
    validator(_rule: any, value: any) {
      if (!Object.keys(value)?.length) {
        return Promise.reject('请配置卡片');
      }
      const {field1Code, titleCode, field2Title, field2Code, field1Title} = value || {}
      if (!field1Code || !titleCode || !field2Title || !field2Code || !field1Title) {
        return Promise.reject('请配置卡片');
      }
      return Promise.resolve();
    },
    trigger: "change",
  },
];

const onSave = () => {
  formRef.value.validate().then((res: any) => {
    if (res) {
      if(modelRef.model?.length === 2) {
        emits('save', modelRef)
      } else {
        emits('save', {
          model: modelRef.model
        })
      }
    }
  })
};
</script>

<style lang="less" scoped>
.box {
  max-height: 450px;
  overflow-y: auto;
}
</style>

