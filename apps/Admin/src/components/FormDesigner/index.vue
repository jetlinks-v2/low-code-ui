<template>
  <div class="container">
    <Header />
    <div class="box">
      <div class="left"><Filed /></div>
      <div class="right"><Canvas :data="designer?.formData?.children"></Canvas></div>
      <!-- <div class="config" v-if="designer.isShowConfig"><Config /></div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from './components/Header/index.vue'
import Canvas from './components/Panels/Canvas/index'
import Config from './components/Panels/Config/index.vue'
import Filed from './components/Panels/Filed/index'
import { useFormDesignerStore } from '@/store/designer'

// const props = defineProps({
//   inlineMax: { // inline横排最多展示的组件个数
//     type: Number,
//     default: 4,
//   },
//   fileUploadURI: { // 上传组件的action
//     type: String,
//   },
// })

const designer = useFormDesignerStore()

</script>

<style lang="less" scoped>
.container {
  .box {
    display: flex;
    width: 100%;
    height: calc(100% - 50px);
    background-color: #fff;
    overflow: hidden;
    .left {
      width: 300px;
    }

    .right {
      flex: 1;
    }

    .config {
      width: 300px;
    }
  }
}
</style>