<template>
  <div class="container">
    <Canvas ref="canvasRef"></Canvas>
  </div>
</template>

<script lang="ts" setup>
import Canvas from "./components/Panels/Canvas/index";
import { provide, ref, watch } from "vue";
import { ISchema } from "./typings";
import { initData } from "./utils/defaultData";
import { cloneDeep } from "lodash-es";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  pageValue: {
    type: Object,
  }
});

// const emit = defineEmits([]);
const pageData = ref<ISchema>(initData); // 表单数据
const dependencies = ref({}) // 依赖项
const canvasRef = ref()

watch(
  () => JSON.stringify(props.data),
  () => {
    pageData.value = cloneDeep(props.data) as ISchema;
  },
  {
    immediate: true,
  }
);

provide("PageDesigner", {
  model: "preview",
  pageData,
  dependencies,
  pageValue: props.pageValue
});
const getRefs = () => {
  return canvasRef.value?.$refs
}
defineExpose({
  getRefs,
})
</script>

<style lang="less" scoped>
.container {
  background-color: #fff;
}
</style>
