<template>
  <div class="config-center">
    <div class="content" v-if="props.showSwitch">
      <p>
        开启表头排序
        <j-tooltip title="用于控制该列数据置顶/置底展示">
          <AIcon type="QuestionCircleOutlined" />
        </j-tooltip>
      </p>
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
      <div style="width: 500px">
        <EditorButton v-model:value="state.specialStyle" language="css" text="编写特殊样式">
        </EditorButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EditorButton from '@/components/EditorModal/EditorButton.vue'
const props = defineProps({
  showSwitch: {
    type: Boolean,
    default: true,
  },
  config: {
    type: Object,
    default: {},
  },
})
interface Emit {
  (e: 'update:state', value: any): void
}
const emits = defineEmits<Emit>()
const state = reactive({
  checked: props.config?.config?.checked,
  colLayout: props.config?.config?.colLayout || 'left',
  specialStyle: props.config?.config?.specialStyle || `/* .test {
    color: red;
  } */`,
})

watch(
  () => state,
  () => {
    emits('update:state', state)
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
    margin-bottom: 8px;
    margin-bottom: 8px;
  }
}
</style>
