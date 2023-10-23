<template>
  <page-container>
    <FullPage>
      <j-row>
        <j-col :span="12">
          <!-- <div class="form" v-for="(item, index) of formData">
            <preview
              ref="previewRef"
              :value="formValue[index]"
              :data="item.configuration"
            />
          </div> -->
          <div class="form">
            <template v-for="(item, index) in formList" :key="index">
              <div>{{ item.formName }}</div>
              <FormPreview
                v-if="!item.multiple"
                ref="previewRef"
                :value="formValue[index]"
                :data="item.fullInfo?.configuration"
              />
              <!-- <TableFormPreview
                v-else
                v-model:data-source="tableData[item.formId]"
                :columns="
                  getTableColumns(item.fullInfo?.configuration?.children, item.formId)
                "
              /> -->
              <TableFormPreview
                v-else
                v-model:data-source="tableData[item.formId]"
                :columns="
                  getTableColumns(
                    item.fullInfo?.configuration?.children,
                    item.formId,
                  )
                "
              />
            </template>
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
import TableFormPreview from '@/views/process/model/Detail/FlowDesign/components/TableFormPreview.vue'
import FormPreview from '@/components/FormDesigner/preview.vue'

interface FormsProps {
  formId: string
  formName: string
  fullInfo: any
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
const formData: Ref<formDataProps[]> = ref([])
const currentProcess = reactive<any>({})
const previewRef = ref<any>()

const formValue = ref<any[]>([])

const formList = ref<FormsProps[]>([])

// 草稿
const draft = ref<any>({})

const tableData = reactive({})
// const tableData = ref<any>([{}])
const getTableColumns = (fields: any[], formId: string) => {
  const draftData = getDraftData(formId)
  const _columns = fields?.map((m) => ({
    title: m.formItemProps?.label,
    dataIndex: m.formItemProps?.name,
    ellipsis: true,
    ...m,
  }))
  console.log('getTableColumns', _columns)
  tableData[formId] = [{}]
  _columns?.forEach((item) => {
    // tableData.value[0][item.dataIndex] = draftData[item.dataIndex] || undefined
    tableData[formId][0][item.dataIndex] =
      draftData[item.dataIndex] || undefined
  })
  return _columns
}

// 获取草稿数据
const getDraftData = (id: string) => {
  return draft.form?.find((i) => i.formId === id) || {}
}
/**
 * 判断数组对象中的属性是否有数据
 * @param array
 */
const hasData = (array: any[]) => {
  if (array?.length < 1) return false
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
  const list = previewRef.value.map((item) => item.formState)
  if (hasData(list)) {
    Modal.confirm({
      title: '是否保存申请表单为草稿？',
      okText: '保存',
      cancelText: '不保存',
      onOk() {
        // 不校验必填项保存已填数据，toast提示“保存成功”并返回发起申请页；
        // 再次发起该流程时横幅提示“继续编辑草稿”
        startProcess(list, false).then((flag) => {
          flag ? router.back() : ''
        })
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
  const list = previewRef.value?.map((item) => item.onSave())

  Promise.all(list).then((res) => {
    startProcess(res).then((flag) => {
      // 跳转至我的流程-我发起的
      flag ? router.push('') : ''
    })
  })
}
/**
 * 保存
 */
const save = () => {
  const list = previewRef.value.map((item) => item.formState)
  console.log('save保存', list)
  startProcess(list, false).then((flag) => {
    // 跳转至我的流程-我的待办
    flag ? router.push('') : ''
  })
}
onMounted(() => {
  // 草稿
  if (route.query.draft) {
    Modal.confirm({
      title: '继续编辑草稿？',
      okText: '是',
      cancelText: '否',
      onOk() {
        // formValue.value = JSON.parse(dataStr)
      },
      onCancel() {},
    })
  }
})

/**
 * 发起流程处理
 * @param list 表单数据
 */
const startProcess = async (list: any, start: boolean = true) => {
  const param = {
    id: route.query.id,
    start: start,
    form: formList.value?.map((i, index) => ({
      formId: i.formId,
      data: tableData.hasOwnProperty(i.formId)
        ? tableData[i.formId][0]
        : list[index],
    })),
    variables: {},
  }
  console.log('param', param)
  return start_api(param).then((resp) => {
    if (resp.success) {
      onlyMessage(`${start ? '提交' : '保存'}成功`)
      return true
    } else {
      return false
    }
  })
}

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
      // getFormData(obj.config?.forms)

      // formData.value = obj.config.forms
      formList.value = obj.config.forms?.map((m) => {
        const _fields = m.fullInfo.configuration?.children
        _fields?.forEach((p) => {
          p.componentProps.disabled = !p.accessModes.includes('write')
        })
        return { accessModes: [], ...m }
      })
    } catch (error) {}
  })
}
// /**
//  * 获取当前流程的表单列表
//  * @param list
//  */
// const getFormData = (list: FormsProps[]) => {
//   const param = {
//     paging: true,
//     terms: [
//       {
//         type: 'and',
//         value: list.map((i) => i.formId),
//         termType: 'in',
//         column: 'id',
//       },
//     ],
//   }
//   queryForm_api(param).then((res) => {
//     if (res.success) {
//       formData.value = res.result.data
//     }
//   })
// }
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
