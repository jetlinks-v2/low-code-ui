<template>
  <div class="container">
    <Header />
    <div class="box">
      <div class="left" v-if="model !== 'preview'"><Filed /></div>
      <div class="center"><Canvas></Canvas></div>
      <div class="right" v-if="isShowConfig && model !== 'preview'">
        <Config></Config>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Canvas from "./components/Panels/Canvas/index";
import Filed from "./components/Panels/Filed/index.vue";
import Config from "./components/Panels/Config/index.vue";
import Header from "./components/Header/index.vue";
import { provide, ref, watch } from "vue";
import { cloneDeep } from "lodash-es";
import { initData } from "./utils/utils";

const props = defineProps({
  data: {
    type: Object,
  },
});

const emits = defineEmits(["saveData", "back"]);
const model = ref<"preview" | "edit">("edit"); // 预览；编辑
const pageData = ref<any>(initData); // 表单数据
const isShowConfig = ref<boolean>(false); // 是否展示配置
const selected = ref<any[]>([]); // 被选择数据,需要多选
const _ctrl = ref<boolean>(false);
const focus = ref<boolean>(false);
const focused = ref<boolean>(false); // 记录弹框的快捷键问题
const copyData = ref<any[]>([]);

provide("PageDesigner", {
  data: props.data,
  model,
  pageData,
  isShowConfig,
  selected,
  _ctrl,
  focus,
  focused,
  copyData,
});

watch(
  () => props.data,
  (newVal) => {
    try {
      const obj = JSON.parse(newVal?.configuration?.code);
      pageData.value = Object.keys(obj).length ? obj : cloneDeep(initData);
    } catch (error) {
      pageData.value = cloneDeep(initData);
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>

<style lang="less" scoped>
.container {
  height: 100vh;
  .box {
    display: flex;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    gap: 6px;
    height: calc(100% - 50px);
    .left {
      width: 200px;
      height: 100%;
      background-color: #fff;
    }

    .center {
      flex: 1;
      height: 100%;
    }
    .right {
      width: 300px;
      height: 100%;
      background-color: #fff;
    }
  }
}
</style>

