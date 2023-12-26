<template>
  <page-container>
    <FullPage>
      <div class="detail">
        <div class="spin" v-if="spinning">
          <j-spin :spinning="spinning" />
        </div>
        <j-row :gutter="[16, 16]" v-else>
          <j-col :span="12">
            <j-scrollbar style="height: calc(100vh - 225px)">
              <div class="form">
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
                  <span v-else>
                    <QuickEditTable
                      serial
                      validate
                      ref="tableRef"
                      style="height: 500px"
                      :data="tableData[item.formId]"
                      :columns="item._columns"
                      :height="500"
                      :scroll="{ x: 1600 }"
                    >
                      <template
                        v-for="j in item._columns"
                        #[j.dataIndex]="{ index, record, valueChange }"
                      >
                        <FormItem
                          v-model="record[j.dataIndex]"
                          :item-type="j.type"
                          :disabled="j.componentProps?.disabled"
                          :component-props="j.componentProps"
                          @change="
                            () => {
                              valueChange(record[j.dataIndex])
                            }
                          "
                        />
                      </template>
                    </QuickEditTable>
                    <j-button
                      @click="() => addTableData(item)"
                      block
                      style="margin-top: 10px"
                      >新增</j-button
                    >
                  </span>
                </template>
              </div>
            </j-scrollbar>
          </j-col>
          <j-col :span="12">
            <!-- 流程图 -->
            <div class="flow-chart" style="height: calc(100vh - 225px)">
              <div class="flow-title">审批流程</div>
              <FlowDesigner readOnly dragging :nodesData="nodesData" />
            </div>
          </j-col>
          <j-col :span="4" :offset="8">
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
              </div>
            </j-affix>
          </j-col>
        </j-row>
      </div>
    </FullPage>
  </page-container>
</template>
<script setup lang="ts">
import { onlyMessage } from '@jetlinks-web/utils'
import FlowDesigner from '@LowCode/components/FlowDesigner'
import { Modal } from 'jetlinks-ui-components'
import {
  create_api,
  start_api,
  getList_api,
  processDetail_api,
  save_api,
} from '@LowCode/api/process/initiate'
import { handleFormToTable } from '@LowCode/views/process/model/Detail/FlowDesign/components/TableFormPreviewUtil'
import FormPreview from '@LowCode/components/FormDesigner/preview.vue'
import md5 from 'md5'
import { getMeProcessList } from '@LowCode/api/process/me'
import { getImage } from '@jetlinks-web/utils'
import { useMenuStore } from '@LowCode/store'
import FormItem from '@LowCode/views/process/me/Detail/components/FormItem.vue'
import { handleRules } from '@LowCode/components/FormDesigner/hooks/useProps'
import { isArray } from 'lodash-es'
import {QuickEditTable} from '@LowCode/components/index'

interface FormsProps {
  formId: string
  formKey?: string
  formName: string
  fullInfo: any
  multiple: boolean
  data?: any
  _columns?: any[]
}

const menu = useMenuStore()
const loading = ref<boolean>(false)
const router = useRouter()
const route = useRoute()
const previewRef = ref<any>()
const formRef = ref<any>()
const tableRef = ref()

const spinning = ref<boolean>(false)
// 流程图
const nodesData = ref<any>({})

const formList = ref<FormsProps[]>([])
// 表单版本
const formVersion = reactive({})
// 草稿
const draftId = ref<string | undefined>('')
const editDraft = ref<Boolean>(false)

const tableData = reactive({})

const addTableData = (item: any) => {
  let obj = {}
  item._columns.map((i) => {
    const key = i.dataIndex
    obj[key] = undefined
  })
  tableData[item.formId].push(obj)
}

const getTableColumns = (
  fields: any[],
  formId: string,
  data: any,
  multiple: boolean,
) => {
  const _columns = fields?.map((m) => ({
    title: m.formItemProps?.label,
    dataIndex: m.formItemProps?.name,
    ellipsis: true,
    formId,
    multiple,
    // minWidth: 200,
    ...m,
    form: {
      rules: handleRules(m),
    },
  }))
  if (isArray(data)) {
    tableData[formId] = data.reverse()
  }
  return handleFormToTable(_columns)
}

/**
 * 判断数组对象中的属性是否有数据
 * @param array
 */
const hasData = (array: any[] = []) => {
  const tableList: any = Object.values(tableData)

  if (tableList.length < 1 && array?.length < 1) {
    return false
  } else {
    let flag = false
    for (const i of array) {
      flag = Object.values(i).some((key: any) => key || key?.length > 0)
      if (flag) break
    }
    // tableList?.forEach((item: any) => {
    // flag = Object.values(item[0]).some((key: any) => key || key?.length > 0)
    // })
    flag = tableList
      .flat(2)
      ?.some((item) =>
        Object.values(item)?.some((key: any) => key || key?.length > 0),
      )
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
        const res = draftId.value
          ? await save_api({ ...param, id: draftId.value })
          : await create_api({ ...param, start: false, id: route.query.id })

        if (res.success) {
          onlyMessage('保存成功')
          menu.jumpPage('process/me/initiate', {
            query: {
              state: 'ready',
            },
          })
        }
      },
      onCancel() {
        // 关闭弹窗并返回发起申请页
        router.back()
      },
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
  const baseForm = previewRef.value?.map((item) => item.onSave()) || []
  const tableForm = tableRef.value?.map((i) => i.validates()) || []

  Promise.all([...baseForm, ...tableForm])
    .then(async (res) => {
      const param = startProcess(res, true)
      const resp = editDraft.value
        ? await start_api({ ...param, id: draftId.value })
        : await create_api({ ...param, id: route.query.id })
      if (resp.success) {
        onlyMessage('提交成功')
        menu.jumpPage('process/me/initiate', {})
      }
    })
    .finally(() => {
      loading.value = false
    })
}

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
            // draftId.value = undefined
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
    // id: draftId.value || route.query.id,
    data: {
      form: formList.value?.map((i) => ({
        formId: editDraft.value
          ? i.formId
          : md5(i.formId + '|' + formVersion[i.formId]),
        data: i.multiple ? tableData[i.formId] : list[flag++],
        formKey: i.formKey ?? i.formId,
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
      const _fields = editDraft.value
        ? m.configuration?.children
        : m.fullInfo.configuration?.children
      _fields?.forEach((p) => {
        const accessModes = bindMap
          .get(m.formId)
          ?.find(
            (k) => (k.ownerBy ?? k.id) === p.formItemProps.name,
          )?.accessModes
        p.componentProps.disabled = !accessModes?.includes('write')
      })
      if (m.multiple) {
        tableData[m.formId] = [{}]
        m._columns = getTableColumns(_fields, m.formId, m.data, m.multiple)
      }
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
  }
}
</style>
