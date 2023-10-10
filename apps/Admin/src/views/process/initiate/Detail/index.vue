<template>
  <page-container>
    <FullPage>
      <j-row>
        <j-col :span="12">
          <div class="form" v-for="(item, index) of formData">
            <preview
              ref="previewRef"
              :value="formValue[index]"
              :data="item.configuration"
              @change="change"
            />
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
import { start_api, getList_api } from '@/api/process/initiate'
import { queryForm_api } from '@/api/process/model'

interface FormsProps {
  formId: string
  multiple: boolean
}

interface formDataProps {
  id: string
  name: string
  provider: string
  configuration: any
}

const router = useRouter()
const route = useRoute()
const formData: Ref<formDataProps[]> = ref([
  {
    id: '123',
    configuration: {
      code: '123',
      type: 'form',

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
    },
  },
  {
    configuration: {
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
    },
  },
])
// const formData: Ref<formDataProps[]> = ref([])
const currentProcess = reactive<any>({})
const previewRef = ref<any>()

const formValue = ref<any[]>([])

const change = (val: any) => {
  console.log('change', val)
  localStorage.removeItem(`${route.query.id}`)
}

// 判断对象中的属性是否有数据
const hasData = (array) => {
  if (array.length < 1) return false
  let flag = false
  for (const i of array) {
    const arr = Object.values(i).filter((key: any) => key && key.length > 0)
    if (arr.length > 0) {
      flag = true
      break
    }
  }
  return flag
}

/**
 * 取消
 */
const cancel = () => {
  const list = previewRef.value.map(item => item.formState)
  if (hasData(list)) {
    Modal.confirm({
      title: '是否保存申请表单为草稿？',
      okText: '保存',
      cancelText: '不保存',
      onOk() {
        // 不校验必填项保存已填数据，toast提示“保存成功”并返回发起申请页；
        // 再次发起该流程时横幅提示“继续编辑草稿”
        localStorage.setItem(`${route.query.id}`, JSON.stringify(list))
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
}
/**
 * 提交
 */
const submit = () => {
  const list = previewRef.value.map(item => item.onSave())
  Promise.all(list).then((res) => {
    const param = {
      id: route.query.id,
      form: formData.value.map((i, index) => {
        return {
          formId: i.id,
          data: res[index],
        }
      }),
    }
    start_api(param).then((resp) => {
      if (resp.success) {
        onlyMessage('提交成功')
        // 跳转至我的流程-我发起的
        router.push('')
      }
    })
  })
}
/**
 * 保存
 */
const save = () => {
  // 不需要校验表单中的必填项，保存所有已填写内容：
  // toast提示“提交成功”并跳转至 我的流程-我的待办 页面
  const list = previewRef.value.map(item => item.formState)

  // onlyMessage('提交成功')
  // // 跳转至我的流程-我的待办
  // router.push('')
}
onMounted(() => {
  // 存在草稿
  const dataStr = localStorage.getItem(`${route.query.id}`)
  console.log('dataStr', dataStr)
  if (dataStr !== null) {
    Modal.confirm({
      title: '继续编辑草稿？',
      okText: '是',
      cancelText: '否',
      onOk() {
        formValue.value = JSON.parse(dataStr)
      },
      onCancel() {},
    })
  }
})
/**
 * 获取当前流程
 */
const getProcess = () => {
  getList_api({
    terms: [
      {
        type: 'and',
        value: route.query.id,
        termType: 'eq',
        column: 'id',
      },
    ],
  }).then((res) => {
    Object.assign(currentProcess, res.result.data[0])
    try {
      const obj = JSON.parse(currentProcess.model)
      getFormData(obj.config?.forms)
    } catch (error) {}
  })
}
/**
 * 获取当前流程的表单列表
 * @param list
 */
const getFormData = (list: FormsProps[]) => {
  const param = {
    paging: true,
    terms: [
      {
        type: 'and',
        value: list.map((i) => i.formId),
        termType: 'in',
        column: 'id',
      },
    ],
  }
  queryForm_api(param).then((res) => {
    if (res.success) {
      formData.value = res.result.data
    }
  })
}
getProcess()
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
