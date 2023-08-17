<template>
  <div class="header">
    <div class="left">
      <j-space :size="24">
        <span>提供多种方式帮助你快速添加表单页内容</span>
        <j-button type="primary">快速添加</j-button>
      </j-space>
    </div>
    <div class="right">
      <j-space>
        <j-button type="link">校验</j-button>
        <j-button
          type="link"
          v-if="designer.model === 'edit'"
          @click="onPreview('preview')"
          >预览</j-button
        >
        <j-button type="link" v-else @click="onPreview('edit')">取消</j-button>
      </j-space>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { useFormDesignerStore } from '@/store/designer'

const designer = useFormDesignerStore()

const onPreview = (_type: 'preview' | 'edit') => {
  designer.setModel(_type)
  designer.setSelection('root')
}
</script>

  <style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  height: 50px;
  padding: 0 20px;
  margin-bottom: 1px;
}
</style>