<template>
  <page-container>
    <FullPage>
      <div class="detail">
        <div class="spin" v-if="spinning">
          <j-spin :spinning="spinning" />
        </div>
        <j-row :gutter="[16, 16]" v-else>
          <j-col :span="10">
            <j-scrollbar style="height: calc(100vh - 225px)">
              <div class="form">
                <j-form ref="formRef" :model="tableData" autocomplete="off">
                  <template v-for="(item, index) in formList" :key="index">
                    <j-space>
                      <img
                        :src="getImage(`/flow-designer/preview-form.png`)"
                        style="height: 16px"
                      />
                      <span>
                        {{ item.formName }}
                      </span>
                    </j-space>
                    <FormPreview
                      v-if="!item.multiple"
                      ref="previewRef"
                      :value="item.data"
                      :data="item.fullInfo?.configuration"
                    />
                    <TableFormPreview
                      v-else
                      v-model:data-source="tableData[item.formId]"
                      :hasRules="true"
                      :columns="
                        getTableColumns(
                          item.fullInfo?.configuration?.children,
                          item.formId,
                          item.data,
                          item.multiple,
                        )
                      "
                    />
                  </template>
                </j-form>
              </div>
            </j-scrollbar>
          </j-col>
          <j-col :span="10" :offset="4">
            <!-- 流程图 -->
            <div class="flow-chart" style="height: calc(100vh - 225px)">
              <div class="flow-title">审批流程</div>
              <FlowDesigner readOnly dragging :nodesData="nodesData" />
            </div>
          </j-col>
          <j-col :span="4" :offset="10">
            <j-affix :offset-bottom="24">
              <div class="btn-list">
                <j-button class="btn" @click="cancel">取消</j-button>
                <j-button
                  class="btn"
                  type="primary"
                  :loading="loading"
                  @click="submit"
                  >提交</j-button
                >
                <!-- <j-button class="btn" type="primary" @click="save"
                  >保存</j-button
                >-->
              </div>
            </j-affix>
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
  create_api,
  start_api,
  getList_api,
  processDetail_api,
  save_api,
} from '@/api/process/initiate'
import TableFormPreview from '@/views/process/model/Detail/FlowDesign/components/TableFormPreview.vue'
import FormPreview from '@/components/FormDesigner/preview.vue'
import md5 from 'md5'
import { getMeProcessList } from '@/api/process/me'
import { getImage } from '@jetlinks/utils'

interface FormsProps {
  formId: string
  formName: string
  fullInfo: any
  multiple: boolean
  data?: any
}

const loading = ref<boolean>(false)
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
// const draft = reactive<draftProps>({} as draftProps)
// const hasDraft = ref<Boolean>(false)
const draftId = ref<string>('')
const editDraft = ref<Boolean>(false)

const tableData = reactive({})
const getTableColumns = (
  fields: any[],
  formId: string,
  data: any = {},
  multiple: boolean,
) => {
  const _columns = fields?.map((m) => ({
    title: m.formItemProps?.label,
    dataIndex: m.formItemProps?.name,
    ellipsis: true,
    formId,
    multiple,
    width: 200,
    ...m,
  }))

  _columns?.forEach((item) => {
    if (tableData[formId]) {
      if (multiple && data[0]) {
        tableData[formId][0][item.dataIndex] = data[0][item.dataIndex]
      } else {
        tableData[formId][0][item.dataIndex] = data[item.dataIndex]
      }
    }
  })
  return _columns
}

/**
 * 判断数组对象中的属性是否有数据
 * @param array
 */
const hasData = (array: any[] = []) => {
  const tableList = Object.values(tableData)

  if (tableList.length < 1 && array?.length < 1) {
    return false
  } else {
    let flag = false
    for (const i of array) {
      flag = Object.values(i).some((key: any) => key || key?.length > 0)
      if (flag) break
    }
    tableList?.forEach((item: any) => {
      flag = Object.values(item[0]).some((key: any) => key || key?.length > 0)
    })
    return flag
  }
}

/**
 * 取消
 */
const cancel = () => {
  const list = previewRef.value?.map((item) => item.formState)
  if (hasData(list)) {
    Modal.confirm({
      title: '是否保存申请表单为草稿？',
      okText: '保存',
      cancelText: '不保存',
      async onOk() {
        const param = startProcess(list)
        // 没有草稿_create
        const res = draftId.value ? await save_api(param): await create_api({...param, start: false})

        // save_api(param).then((res) => {
          if (res.success) {
            onlyMessage('保存成功')
            router.push({
              path: '/flow-engine/me/initiate',
              query: {
                state: 'ready',
              },
            })
          }
        // })
      }
    })
        // 关闭弹窗并返回发起申请页
  } else {
    router.back()
  }
}
/**
 * 提交
 */
const submit = async () => {
  loading.value = true
  const list = previewRef.value?.map((item) => item.onSave()) || []
  Promise.all([...list, formRef.value.validate()])
    .then(async (res) => {
      const param = startProcess(res, true)
      const resp = editDraft.value
        ? await start_api(param)
        : await create_api(param)
      if (resp.success) {
        onlyMessage('提交成功')
        router.push('/flow-engine/me/initiate')
      }
    })
    .finally(() => {
      loading.value = false
    })
}
// /**
//  * 保存
//  */
// const save = () => {
//   const list = previewRef.value?.map((item) => item.formState)
//   startProcess(list, false).then((flag) => {
//     // 跳转至我的流程-我的待办
//     flag ? router.push('/flow-engine/me/todo') : ''
//   })
// }
onMounted(() => {
  spinning.value = true
  // 草稿箱进入
  if (route.query.isDraft === 'true') {
    editDraft.value = true
    draftId.value = route.query.id as string
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
        draftId.value = res.result.data[0].id
        Modal.confirm({
          title: '继续编辑草稿？',
          okText: '是',
          cancelText: '否',
          onOk() {
            editDraft.value = true
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
const startProcess = (list: any, start: boolean | undefined = undefined) => {
  let flag = 0
  const param = {
    id: draftId.value || route.query.id,
    data: {
      form: formList.value?.map((i) => ({
        formId: editDraft.value
          ? i.formId
          : md5(i.formId + '|' + formVersion[i.formId]),
        data: i.multiple ? tableData[i.formId][0] : list[flag++],
      })),
      variables: {},
    },
    start,
  }
  return param
}

// 处理数据
const handleData = (data: any, model: string) => {
  Object.assign(formVersion, data.others?.formVersion)
  try {
    const obj = JSON.parse(model)
    nodesData.value = obj.nodes

    //详情接口nodeId
    const bindMap = new Map()
    Object.keys(obj.nodes.props.formBinds || {}).forEach((item) => {
      bindMap.set(
        editDraft.value ? md5(item + '|' + formVersion[item]) : item,
        obj.nodes.props.formBinds[item],
      )
    })
    const forms = editDraft.value ? data.form : obj.config.forms

    formList.value = forms?.map((m) => {
      if (m.multiple) {
        tableData[m.formId] = [{}]
      }
      const _fields = editDraft.value
        ? m.configuration?.children
        : m.fullInfo.configuration?.children
      _fields?.forEach((p) => {
        const accessModes = bindMap
          .get(m.formId)
          ?.find((k) => k.id === p.formItemProps.name)?.accessModes
        p.componentProps.disabled = !accessModes?.includes('write')
      })
      return {
        accessModes: [],
        fullInfo: { configuration: m.configuration },
        ...m,
      }
    })
  } catch (error) {} finally {
    spinning.value = false
  }
}

/**
 * 获取当前流程
 */
const getProcess = () => {
  getList_api({
    paging: false,
    terms: [
      {
        type: 'and',
        value: route.query.id,
        termType: 'eq',
        column: 'id',
      },
    ],
  }).then((res) => {
    const data = res.result[0]
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

  .flow-chart {
    border-left: 1px solid #f0f0f0;

    .flow-title {
      height: 64px;
      padding: 22px 20px;
      font-size: 18px;
      font-weight: 500;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 16px;
    }
  }

  .btn-list {
    // width: 276px;
    height: 44px;
    display: flex;
    justify-content: space-evenly;
    gap: 8px;
    margin-top: 10px;
    // .btn {
    //   width: 20%;
    // }
  }
}
</style>
