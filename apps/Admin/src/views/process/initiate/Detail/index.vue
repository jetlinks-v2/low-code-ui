<template>
  <page-container>
    <FullPage>
      <j-row>
        <j-col :span="12">
          <div class="form">
            <preview ref="previewRef" :value="formData" :data="data" />
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
    </FullPage>
  </page-container>
</template>
<script setup lang="ts">
import { onlyMessage } from '@jetlinks/utils'
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

const formData = reactive<any>({})

// 判断对象中的属性是否有数据
const hasData = (obj) => {
  if (!obj) return false
  const arr = Object.values(obj).filter((key: any) => key && key.length > 0)
  return arr.length > 0
}

/**
 * 取消
 */
const cancel = () => {
  previewRef.value.onSave().then((res) => {
    console.log(`output->res`, res)
    // 有数据
    if (hasData(res)) {
      Modal.confirm({
        title: '是否保存申请表单为草稿？',
        okText: '保存',
        cancelText: '不保存',
        onOk() {
          // 不校验必填项保存已填数据，toast提示“保存成功”并返回发起申请页；
          // 再次发起该流程时横幅提示“继续编辑草稿”

          localStorage.setItem('processData', JSON.stringify(res))
          onlyMessage('保存成功')
          router.back()
        },
        onCancel() {
          // 关闭弹窗并返回发起申请页
          router.back()
        },
      })
    } else {
      router.back()
    }
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
      // onlyMessage('提交成功')
    })
    .catch((err) => {
      console.log(`output->error`, err.values)
    })
}
/**
 * 保存
 */
const save = () => {
  // 不需要校验表单中的必填项，保存所有已填写内容：
  // toast提示“提交成功”并跳转至 我的流程-我的待办 页面
}
onMounted(() => {
  // 存在草稿
  const dataStr = localStorage.getItem('processData')
  console.log('dataStr', dataStr)
  if (dataStr !== null) {
    Modal.confirm({
      title: '继续编辑草稿？',
      okText: '是',
      cancelText: '否',
      onOk() {
        Object.assign(formData, JSON.parse(dataStr))
      },
      onCancel() {},
    })
  }
})

// // 流程表单内容变更时，清空草稿。
// // const flag = 
// watch(formData, (newV,oldV) => {
//   console.log('newV,oldV', newV,oldV);
//   // console.log('formData', formData)
//   localStorage.removeItem('processData')
//   // flag();
// },{deep: true})
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
  // border: 1px solid #ccc;
}
</style>
