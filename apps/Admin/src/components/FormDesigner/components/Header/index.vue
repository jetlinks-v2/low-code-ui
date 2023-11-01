<template>
  <div class="header">
    <template v-if="type === 'low-code'">
      <div class="left" v-if="isEditModel">
        <j-space :size="12">
          <span>提供多种方式帮助你快速添加表单页内容</span>
          <QuickAdd :data="data" />
        </j-space>
      </div>
      <div class="right">
        <j-space>
          <j-button v-if="isEditModel" type="primary" @click="onCheck"
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
        </j-space>
      </div>
    </template>
    <template v-else>
      <div class="left">
        <j-button @click="emits('back')">返回</j-button>
        <template v-if="!isEditModel">
          <j-button type="link" @click="onPreview('edit')"
            ><AIcon type="LeftOutlined" />结束预览</j-button
          >
          <div>正在预览</div>
        </template>
      </div>
      <j-space>
        <j-button
          type="primary"
          v-if="isEditModel"
          @click="onPreview('preview')"
          style="padding-left: 4px; padding-right: 4px"
          ><AIcon style="font-size: 20px" type="CaretRightOutlined"
        /></j-button>
        <PermissionButton
          @click="onSave"
          type="primary"
          hasPermission="code:form_save"
        >
          保存
        </PermissionButton>
        <!-- <j-button type="primary" @click="onSave">保存</j-button> -->
      </j-space>
    </template>
  </div>
</template>
  
<script lang="ts" setup>
import { cloneDeep } from 'lodash-es'
import { inject, computed, unref } from 'vue'
import { getFieldData } from '../../utils/utils'
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

const emits = defineEmits(['save', 'validate', 'back'])

const isEditModel = computed(() => {
  return unref(designer?.model) === 'edit'
})

const onPreview = (_type: 'preview' | 'edit') => {
  designer.setModel(_type)
  designer.setSelection('root')
  const obj = cloneDeep(getFieldData(designer.formData.value))
  const path = Object.keys(obj)
  Object.assign(designer.formState, obj)
  Object.keys(designer.formState).forEach((i) => {
    if (!path.includes(i)) {
      delete designer.formState[i]
    }
  })
}

const onCheck = () => {
  emits('validate')
}

const onSave = () => {
  emits('save')
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

  .left {
    display: flex;
    align-items: center;
  }
}
</style>