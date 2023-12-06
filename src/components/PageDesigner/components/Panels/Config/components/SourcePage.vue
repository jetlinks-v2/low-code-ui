<template>
  <div>
    <j-form-item
      label="数据绑定"
      :validateFirst="true"
      :name="['componentProps', 'source', 'value']"
      :rules="_rules"
    >
      <j-select
        allowClear
        placeholder="请选择"
        :options="options"
        v-model:value="target.componentProps.source.value"
        @change="onDataChange"
      >
      </j-select>
    </j-form-item>
  </div>
</template>

<script setup name="SourcePage" lang="ts">
import { useTarget, useTool } from "../../../../hooks";
import { ref } from "vue";

const { getPageList } = useTool();
const options = ref<any[]>(getPageList.value || []);
const { target } = useTarget();

const emits = defineEmits(["refresh"]);

const _rules = [
  {
    required: true,
    message: "请选择",
  },
  {
    validator(_rule: any, value: string) {
      if (!value) return Promise.resolve();
      const flag = options.value.find((i) => i.value === value);
      if (!flag) return Promise.reject(`表单已被删除`);
      return Promise.resolve();
    },
    trigger: "change",
  },
];

const onDataChange = (e, node) => {
  target.value.componentProps.source.code = node?.code;
  emits("refresh", target.value);
};
</script>

<style scoped>
</style>
