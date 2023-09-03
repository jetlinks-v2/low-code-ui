<template>
  <div class="quick">
    <j-button type="primary" @click="visible = true">快速添加</j-button>
    <j-drawer v-model:visible="visible" title="快速添加" placement="right">
      <p>自由组合快速添加表单页内容</p>
      <div>123</div>
      <div class="btn">
        <j-space>
          <j-button @click="visible = false">取消</j-button>
          <j-button type="primary" @click="onSave">确定</j-button>
        </j-space>
      </div>
    </j-drawer>
  </div>
</template>
  <script lang="ts" setup>
import { ref } from 'vue'
const visible = ref<boolean>(false)

const onSave = () => {
  visible.value = false
}
</script>

<style lang="less" scoped>
.btn {
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  right: 0;
  justify-content: flex-end;
  padding: 10px 24px;
  border-top: 1px solid #f0f0f0;
}
</style>
  
  