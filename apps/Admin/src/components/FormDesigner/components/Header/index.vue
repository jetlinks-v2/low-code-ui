<template>
  <div class="header">
    <div class="left" v-if="isEditModel && type === 'low-code'">
      <j-space :size="12">
        <span>提供多种方式帮助你快速添加表单页内容</span>
        <QuickAdd :data="data" />
      </j-space>
    </div>
    <div class="right">
      <j-space>
        <j-button
          v-if="isEditModel && type === 'low-code'"
          type="primary"
          @click="onCheck"
          >校验</j-button
        >
        <j-button
          type="primary"
          v-if="isEditModel"
          @click="onPreview('preview')"
          style="padding-left: 4px; padding-right: 4px"
          ><AIcon style="font-size: 20px" type="CaretRightOutlined"
        /></j-button>
        <template v-else>
          <j-button type="link" @click="onPreview('edit')"
            ><AIcon type="LeftOutlined" />结束预览</j-button
          >
          <div>正在预览</div>
        </template>
        <template v-if="type === 'workflow'">
          <j-button type="primary" @click="onSave">保存</j-button>
        </template>
      </j-space>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { inject, computed, unref } from 'vue'
import QuickAdd from '../QuickAdd/index.vue'

const designer: any = inject('FormDesigner')

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  type: {
    // 判断是工作流还是低代码
    type: String as PropType<'workflow' | 'low-code'>,
    default: 'low-code',
  },
})

const emits = defineEmits(['save', 'validate'])

const isEditModel = computed(() => {
  return unref(designer?.model) === 'edit'
})

const onPreview = (_type: 'preview' | 'edit') => {
  designer.setModel(_type)
  designer.setSelection('root')
}

const onCheck = () => {
  emits('validate')
}

const onSave = () => {
  
}
</script>

  <style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  height: 48px;
  padding: 0 24px;
  margin-bottom: 1px;
  border-bottom: 1px solid #d9d9d9;
}
</style>