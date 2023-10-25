<template>
  <page-container>
    <FullPage>
      <div class="detail">
        <div class="spin" v-if="spinning">
          <j-spin :spinning="spinning" />
        </div>
        <j-row v-else>
          <j-col :span="12">
            <div class="form">
              <j-form ref="formRef" :model="tableData" autocomplete="off">
                <template v-for="(item, index) in formList" :key="index">
                  <div>{{ item.formName }}</div>
                  <FormPreview
                    v-if="!item.multiple"
                    ref="previewRef"
                    :value="item.data"
                    :data="item.fullInfo?.configuration"
                  />
                  <TableFormPreview
                    v-else
                    v-model:data-source="tableData[item.formId]"
                    :columns="
                      getTableColumns(
                        item.fullInfo?.configuration?.children,
                        item.formId,
                        item.data,
                      )
                    "
                  />
                </template>
              </j-form>
            </div>
            <div class="btn-list">
              <j-button class="btn" @click="cancel">取消</j-button>
              <j-button class="btn" type="primary" @click="submit"
                >提交</j-button
              >
              <j-button class="btn" type="primary" @click="save">保存</j-button>
            </div>
          </j-col>
          <j-col :span="12">
            <!-- 流程图 -->
            <div class="flow-chart">
              <span>审批流程</span>
              <FlowDesigner readOnly :nodesData="nodesData" />
            </div>
          </j-col>
        </j-row>
      </div>
    </FullPage>
  </page-container>
</template>
<script setup lang="ts">
import { onlyMessage } from '@jetlinks/utils'
import FlowDesigner from '@/components/FlowDesigner'
import { Modal } from 'jetlinks-ui-components'
import {
  start_api,
  getList_api,
  processDetail_api,
} from '@/api/process/initiate'
import TableFormPreview from '@/views/process/model/Detail/FlowDesign/components/TableFormPreview.vue'
import FormPreview from '@/components/FormDesigner/preview.vue'
import md5 from 'md5'
import { getMeProcessList } from '@/api/process/me'

interface FormsProps {
  formId: string
  formName: string
  fullInfo: any
  multiple: boolean
  data?: any
}

interface draftProps {
  id: string
  start: boolean
  form: {
    formId: string
    data: any
  }[]
}

const router = useRouter()
const route = useRoute()
const previewRef = ref<any>()
const formRef = ref<any>()

const spinning = ref<boolean>(false)
// 流程图
const nodesData = ref<any>({})

const formList = ref<FormsProps[]>([])
// 表单版本
const formVersion = reactive({})
// 草稿
const draft = reactive<draftProps>({} as draftProps)
const hasDraft = ref<Boolean>(false)

const tableData = reactive({})
const getTableColumns = (fields: any[], formId: string, data: any = {}) => {
  const _columns = fields?.map((m) => ({
    title: m.formItemProps?.label,
    dataIndex: m.formItemProps?.name,
    ellipsis: true,
    formId,
    ...m,
  }))

  _columns?.forEach((item) => {
    if (tableData[formId]) {
      tableData[formId][0][item.dataIndex] =
        // draftData.data?.[item.dataIndex] || undefined
        data[0][item.dataIndex] ?? undefined
    }
  })
  return _columns
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
const submit = async () => {
  const list = previewRef.value?.map((item) => item.onSave()) || []
  Promise.all([...list, formRef.value.validate()]).then((res) => {
    startProcess(res).then((flag) => {
      // 跳转至我的流程-我发起的
      flag ? router.push('/flow-engine/me/initiate') : ''
    })
  })
  // }
}
/**
 * 保存
 */
const save = () => {
  const list = previewRef.value?.map((item) => item.formState)
  startProcess(list, false).then((flag) => {
    // 跳转至我的流程-我的待办
    flag ? router.push('/flow-engine/me/todo') : ''
  })
}
onMounted(() => {
  spinning.value = true
  // 草稿箱进入
  if (route.query.isDraft === 'true') {
    hasDraft.value = true
    getDetail(route.query.id as string)
  } else {
    const param = {
      paging: false,
      terms: [
        {
          value: 'ready',
          termType: 'eq',
          column: 'state',
        },
        {
          value: route.query.id,
          termType: 'eq',
          column: 'modelId',
        },
      ],
    }
    getMeProcessList(param, 'initiate', false).then((res) => {
      if (res.result.total > 0) {
        // 有草稿
        Modal.confirm({
          title: '继续编辑草稿？',
          okText: '是',
          cancelText: '否',
          onOk() {
            hasDraft.value = true
            getDetail(res.result.data[0].id)
          },
          onCancel() {
            getProcess()
          },
        })
      } else {
        getProcess()
      }
    })
  }
})

const getDetail = (id: string) => {
  processDetail_api(id).then((res) => {
    handleData(res.result, res.result.modelContent)
  })
}

/**
 * 发起流程处理
 * @param list 表单数据
 */
const startProcess = async (list: any, start: boolean = true) => {
  let flag = 0
  const param = {
    data: {
      id: route.query.id,
      form: formList.value?.map((i) => ({
        formId: hasDraft.value
          ? i.formId
          : md5(i.formId + '|' + formVersion[i.formId]),
        data: i.multiple ? tableData[i.formId][0] : list[flag++],
      })),
      variables: {},
    },
    start,
  }
  return start_api(param).then((resp) => {
    if (resp.success) {
      onlyMessage(`${start ? '提交' : '保存'}成功`)
      return true
    } else {
      return false
    }
  })
}

// 处理数据
const handleData = (data: any, model: string) => {
  Object.assign(formVersion, data.others?.formVersion)
  try {
    const obj = JSON.parse(model)
    nodesData.value = obj.nodes

    //详情接口nodeId
    const bindMap = new Map()
    Object.keys(obj.nodes.props.formBinds).forEach((item) => {
      bindMap.set(
        hasDraft.value ? md5(item + '|' + formVersion[item]) : item,
        obj.nodes.props.formBinds[item],
      )
    })

    const forms = hasDraft.value ? data.form : obj.config.forms

    formList.value = forms?.map((m) => {
      if (m.multiple) {
        tableData[m.formId] = [{}]
      }
      const _fields = hasDraft.value
        ? m.configuration?.children
        : m.fullInfo.configuration?.children
      _fields?.forEach((p) => {
        const accessModes = bindMap
          .get(m.formId)
          ?.find((k) => k.id === p.key)?.accessModes
        p.componentProps.disabled = !accessModes?.includes('write')
      })

      return {
        accessModes: [],
        fullInfo: { configuration: m.configuration },
        ...m,
      }
    })
  } catch (error) {
  } finally {
    spinning.value = false
  }
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
    const data = res.result.data[0]
    handleData(data, data.model)
  })
}
</script>
<style scoped lang="less">
.detail {
  // text-align: center;
  padding: 20px;
  .spin {
    margin-top: 100px;
    text-align: center;
  }
  .btn-list {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 10px;
    .btn {
      width: 20%;
    }
  }
}
</style>
