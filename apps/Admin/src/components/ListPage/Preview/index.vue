<template>
  <div class="list-form-preview" v-if="props.show">
    <div class="header">
      <j-page-header>
        <template #title>
        <template #title>
          <span class="sub-title">正在预览</span>
        </template>
        <template #extra>
          <j-button type="primary" key="1" @click="back">退出预览</j-button>
          <j-button type="primary" key="1" @click="back">退出预览</j-button>
        </template>
      </j-page-header>
    </div>
    <Preview :data="data"/>
  </div>
</template>
<script setup lang="ts" name="ListPagePreview">
import Preview from './components/Preview.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  id: {
    type: null,
  },
  data: {
    type: String,
    default: '{}'
  }
})
const emits = defineEmits()
//退出预览
const back = () => {
  emits('back')
}

</script>
<style lang="less" scoped>
.list-form-preview {
  background-color: #d7d7d7;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  height: 100vh;
  width: 100vw;
  overflow: auto;
  .header {
    background-color: #FFFFFF;
  }
  .header {
    background-color: #FFFFFF;
  }
}
</style>
