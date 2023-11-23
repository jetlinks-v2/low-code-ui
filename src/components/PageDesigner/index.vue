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

const initData = {
  type: "root",
  key: "root",
  componentProps: {
    padding: 0,
  },
  children: [],
};

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
const focused = ref<boolean>(false);

provide("PageDesigner", {
  model,
  pageData,
  isShowConfig,
  selected,
  _ctrl,
  focus,
  focused
});

watch(
  () => props.data,
  (newVal) => {
    pageData.value =
      newVal && Object.keys(newVal)?.length
        ? cloneDeep(newVal)
        : cloneDeep(initData);
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

