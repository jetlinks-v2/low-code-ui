<template>
  <div class="config-center">
    <div class="content" v-if="props.showSwitch">
      <div class="title">开启表头排序 用于控制该列数据置顶/置底展示</div>
      <j-switch v-model:checked="state.checked" />
    </div>

    <div class="content">
      <slot name="demonstrations"></slot>
    </div>

    <div class="content">
      <div class="title">列排版</div>
      <j-radio-group v-model:value="state.colLayout" button-style="solid">
        <j-space size="large">
          <j-radio-button value="left" class="check-btn">居左</j-radio-button>
          <j-radio-button value="center" class="check-btn">居中</j-radio-button>
          <j-radio-button value="right" class="check-btn">居右</j-radio-button>
        </j-space>
      </j-radio-group>
    </div>

    <div class="content">
      <div class="title">特殊样式</div>
      <j-monaco-editor
        v-model="state.specialStyle"
        language="css"
        style="width: 500px"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useListDataStore} from "@/store/listData";
const props = defineProps({
  showSwitch: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    default: '',
  },
})
const state = reactive({
  checked: props.type === 'object' ? false : true,
  colLayout: 'left',
  specialStyle: undefined,
})
const configurationStore = useListDataStore()

watch(
  () => state,
  () => {
    configurationStore.setListDataInfo(state)
  },
  { immediate: true, deep: true },
)
</script>

<style lang="less" scoped>
.config-center {
  padding-left: 20px;
  .check-btn {
    width: 150px;
    text-align: center;
  }
  .title {
    padding-bottom: 5px;
  }
  .content {
    padding-top: 5px;
  }
}
</style>
