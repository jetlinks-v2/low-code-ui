<template>
  <div class="header">
    <div class="left">
      <j-space :size="24">
        <span>提供多种方式帮助你快速添加表单页内容</span>
        <QuickAdd :data="data" />
      </j-space>
    </div>
    <div class="right">
      <j-space>
        <j-button type="link" v-if="!isEditModel"  @click="emits('save')">提交</j-button>
        <j-button type="link" @click="onInput">打印json</j-button>
        <j-button type="link" @click="onCheck">校验</j-button>
        <j-button
          type="link"
          v-if="isEditModel"
          @click="onPreview('preview')"
          >预览</j-button
        >
        <j-button type="link" v-else @click="onPreview('edit')">取消</j-button>
      </j-space>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { inject, computed, unref } from 'vue'
import { checkedConfig } from '../../utils/utils'
import QuickAdd from '../QuickAdd/index.vue'

const designer: any = inject('FormDesigner')

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  },
})

const emits = defineEmits(['save'])

const isEditModel = computed(() => {
  return unref(designer?.model) === 'edit'
})

const onPreview = (_type: 'preview' | 'edit') => {
  designer.setModel(_type)
  designer.setSelection('root')
}

const onCheck = () => {
  designer.errorKey.value = checkedConfig(unref(designer.formData))
  console.log(designer.errorKey.value)
}

const onInput = () => {
  console.log(unref(designer.formData))
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
  border-bottom: 1px solid #eee;
}
</style>