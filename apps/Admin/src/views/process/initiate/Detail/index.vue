<template>
  <page-container>
    <j-row>
      <j-col :span="12">
        <div class="form">
          <preview
            ref="previewRef"
            :value="{ select_hsvrpinwbtb: '131323232' }"
            :data="data"
          ></preview>
        </div>
        <div class="btn-list">
          <j-button class="btn" @click="cancel">取消</j-button>
          <j-button class="btn" type="primary" @click="submit">提交</j-button>
          <j-button class="btn" type="primary" @click="save">保存</j-button>
        </div>
      </j-col>
      <j-col :span="12">
        <!-- 流程图 -->
        <div class="flow-chart">
          <span>审批流程</span>
          <FlowDesigner readOnly :treeData="{}" />
        </div>
      </j-col>
    </j-row>
  </page-container>
</template>
<script setup lang="ts">
import FlowDesigner from '@/components/FlowDesigner'
import preview from '@/components/FormDesigner/preview.vue'

import { Modal } from 'jetlinks-ui-components'

const router = useRouter()
const data = {
  type: 'root',
  key: 'root',
  componentProps: {
    layout: 'horizontal',
    size: 'default',
    cssCode: '',
    eventCode: '',
  },
  children: [
    {
      type: 'input',
      name: '下拉框',
      key: 'form_jizlh9evql7',
      formItemProps: {
        label: '下拉框',
        required: true,
        rules: [],
        name: 'select_hsvrpinwbtb',
      },
      componentProps: {
        style: {
          width: '100%',
        },
        cssCode: '',
        onChange: '',
        disabled: false,
        description: '',
        placeholder: '请选择',
        source: {
          type: 'dic',
        },
        options: [
          {
            label: '选项1',
            value: '5my4vth6b3r',
          },
          {
            label: '选项2',
            value: 'nj6ocngvrxz',
          },
          {
            label: '选项3',
            value: 'esb3r7usio7',
          },
        ],
        visible: true,
        editable: true,
      },
    },
  ],
}

const previewRef = ref()

/**
 * 取消
 */
const cancel = () => {
  Modal.confirm({
    title: '是否保存申请表单为草稿？',
    okText: '保存',
    cancelText: '不保存',
    onOk() {},
    onCancel() {
      router.back()
    },
  })
}
/**
 * 提交
 */
const submit = () => {
  previewRef.value
    .onSave()
    .then((res) => {
      console.log(`output->res`, res)
    })
    .catch((err) => {
      console.log(`output->error`, err.values)
    })
}
/**
 * 保存
 */
const save = () => {}
</script>
<style scoped lang="less">
.btn-list {
  display: flex;
  justify-content: center;
  gap: 8px;
  .btn {
    width: 20%;
  }
}
.flow-chart {
  border: 1px solid #ccc;
}
</style>
