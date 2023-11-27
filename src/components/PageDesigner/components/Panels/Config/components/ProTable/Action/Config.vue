<template>
  <j-modal
    visible
    title="配置操作列"
    @ok="onSave"
    @cancel="emits('close')"
  >
    <j-form layout="vertical" ref="formRef" :model="formState">
      <j-form-item label="展示" name="visible">
        <j-switch v-model:checked="formState.visible" />
      </j-form-item>
      <template v-if="formState.visible">
        <j-form-item label="请配置对单条数据支持操作" name="actions">
          <List v-model:value="formState.actions" />
        </j-form-item>
      </template>
    </j-form>
  </j-modal>
</template>
  
<script lang="ts" setup>
import { reactive, watchEffect } from "vue";
import { cloneDeep } from "lodash-es";
import List from "./List.vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {
        visible: true,
        actions: [],
      };
    },
  },
});

const emits = defineEmits(["save", "close"]);
const formState = reactive(props.data);

watchEffect(() => {
  Object.assign(formState, cloneDeep(props.data));
});
</script>
  
  