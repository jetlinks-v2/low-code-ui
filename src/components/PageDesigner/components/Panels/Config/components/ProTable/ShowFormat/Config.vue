<template>
  <j-modal
    visible
    title="配置展示格式"
    :width="800"
    @ok="onSave"
    @cancel="emits('close')"
  >
    <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
      <j-form-item label="数据展示方式" name="model">
        <j-checkbox-group
          v-model:value="modelRef.model"
          :options="[
            { label: '数据列表', value: 'TABLE' },
            { label: '卡片列表', value: 'CARD' },
          ]"
        />
      </j-form-item>
      <!-- <j-form-item label="卡片配置" name="model">
        <j-checkbox-group
          v-model:value="modelRef.model"
          :options="[
            { label: '数据列表', value: 'TABLE' },
            { label: '卡片列表', value: 'CARD' },
          ]"
        />
      </j-form-item>
      <j-form-item label="默认形态" name="model">
        <j-checkbox-group
          v-model:value="modelRef.model"
          :options="[
            { label: '数据列表', value: 'TABLE' },
            { label: '卡片列表', value: 'CARD' },
          ]"
        />
      </j-form-item> -->
    </j-form>
  </j-modal>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

const emits = defineEmits(["save", "close"]);

const formRef = ref();

const modelRef = reactive({
  model: undefined,
});

const onSave = () => {};
</script>

