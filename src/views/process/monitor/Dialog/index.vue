<template>
  <j-modal
    visible
    :maskClosable="false"
    title="转办"
    :width="750"
    @cancel="emits('update:visible', false)"
    @ok="confirm"
    class="edit-dialog-container"
    cancelText="取消"
    okText="确定"
    :confirmLoading="loading"
  >
    <j-form ref="formRef" :model="form" autocomplete="off" layout="vertical">
      <j-form-item
        name="original"
        label="原办理人"
        :rules="[{ required: true, message: '请选择原办理人' }]"
      >
        <j-select
          show-search
          v-model:value="form.original"
          placeholder="请选择原办理人"
          :options="originalOptions"
          :filterOption="filterOption"
          @select="originalSelect"
        />
      </j-form-item>
      <j-form-item
        name="target"
        label="转交办理人"
        :rules="[
          {
            required: true,
            message: !form.original ? '请先选择原办理人' : '请选择转交办理人',
            trigger: ['blur', 'change'],
          },
        ]"
      >
        <j-select
          show-search
          v-model:value="form.target"
          placeholder="请选择转交办理人"
          :options="turnOptions"
          :filterOption="filterOption"
          @select="turnSelect"
        />
        <div>转交办理人默认继承原办理人在流程节点中的权重</div>
      </j-form-item>
      <j-form-item
        name="message"
        label="转办原因"
        :rules="[
          {
            max: 16,
            message: '最多输入16个字符',
          },
        ]"
      >
        <j-input v-model:value="form.message" placeholder="示例：人员离职" />
      </j-form-item>
      <j-form-item
        name="processIds"
        label="请选择需要转办的流程"
        :rules="[
          {
            required: true,
            message: '至少选择1条数据',
            trigger: ['blur', 'change'],
          },
        ]"
        validateStatus=""
      >
        <pro-search
          class="pro-search"
          type="single"
          :columns="columns"
          @search="handleSearch"
          :labelWidth="40"
        />
        <JProTable
          ref="tableRef"
          model="table"
          :columns="columns"
          :params="tableParams"
          :request="_query"
          :defaultParams="{
            sorts: [{ name: 'deployTime', order: 'desc' }],
            terms: [{ column: 'state', value: 'ready', termType: 'not' }],
          }"
          :scroll="{ y: 300 }"
          :rowSelection="{
            preserveSelectedRowKeys: true,
            selectedRowKeys: form.processIds,
            onChange: onSelectChange,
          }"
        />
      </j-form-item>
    </j-form>
  </j-modal>
</template>
<script setup lang="ts">
import { onlyMessage } from '@jetlinks-web/utils'
import { useRequest } from '@jetlinks-web/hooks'
import {
  original_list,
  process_list,
  process_tran,
} from '@LowCode/api/process/monitor'
import { getAllUser_api, getUser_api } from '@LowCode/api/user'
import { useClassified } from '@LowCode/hooks/useClassified'
import { message } from 'ant-design-vue'

type FormType = {
  original: string
  target: string
  message: string
  processIds: string[]
}

type IdentitiesType = {
  type: string
  id: string
  name: string
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: () => false,
  },
})

const emits = defineEmits<{
  (e: 'update:visible', flag: boolean): void
  (e: 'refresh'): void
}>()

const { classified } = useClassified()
const columns = [
  {
    title: '流程分类',
    dataIndex: 'classifiedName',
    key: 'classifiedName',
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'select',
      rename: 'classifiedId',
      componentProps: {
        placeholder: '请选择流程分类',
      },
      options: classified,
    },
  },
  {
    title: '流程名称',
    dataIndex: 'modelName',
    key: 'modelName',
    ellipsis: true,
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入流程名称',
      },
    },
  },
  {
    title: '标题',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入标题',
      },
    },
  },
  {
    title: '发起人',
    dataIndex: 'creatorName',
    key: 'creatorName',
    ellipsis: true,
    search: {
      type: 'select',
      rename: 'creatorId',
      componentProps: {
        placeholder: '请选择发起人',
      },
      options: async () => {
        const resp = await process_list({
          query: {
            paging: false,
            sorts: [{ name: 'deployTime', order: 'desc' }],
            ...params.value,
          },
          linkTerms: {
            identities: identities.value,
            types: ['candidate', 'assignee'],
            states: ['todo'],
            sameTaskNotExists: {
              identities: identities.value,
              types: ['assignee'],
              states: ['completed', 'reject'],
            },
          },
        })
        const listMap = new Map()
        if (resp.status === 200) {
          resp.result.data.forEach((item) => {
            listMap.set(item.creatorId, {
              label: item.creatorName,
              value: item.creatorId,
            })
          })
          return [...listMap.values()]
        }
        return []
      },
    },
  },
]

const formRef = ref<any>()
const form = reactive<Partial<FormType>>({})

const params = ref({})
const tableParams = computed(() => {
  return {
    ...params.value,
    linkTerms: {
      identities: identities.value,
      types: ['candidate', 'assignee'],
      states: ['todo'],
      sameTaskNotExists: {
        identities: identities.value,
        types: ['assignee'],
        states: ['completed', 'reject'],
      },
    },
  }
})

// 原办理人
const identities = ref<IdentitiesType[]>([])
const originalOptions = ref<any[]>([])
const turnIdentities = ref<IdentitiesType>()
const turnOptions = ref<any[]>([])

const terms = [
  {
    value: ['candidate', 'assignee'],
    termType: 'in',
    column: 'linkType',
  },
  {
    type: 'and',
    value: 'todo',
    termType: 'eq',
    column: 'state',
  },
  {
    type: 'and',
    value: {
      types: ['assignee'],
      states: ['completed', 'reject'],
    },
    termType: 'wf-identity-same-task-not',
    column: 'taskId',
  },
  {
    type: 'and',
    value: 'user',
    termType: 'eq',
    column: 'dimensionType',
  },
]

original_list({ paging: false, terms }).then((res) => {
  originalOptions.value = res.result.map((i) => ({
    label: i.dimensionName,
    value: i.dimensionId,
  }))
})

const originalSelect = async (value: string, option: any) => {
  form.target = undefined
  form.processIds = []
  identities.value = [
    {
      type: 'user',
      id: value,
      name: option.label,
    },
  ]
  // 根据用户查组织
  const { result } = await getUser_api(value)
  const idList = result.orgList.map((i) => i.id)
  getTurnUser_api(idList, value)
}

const turnSelect = (value: string, option: any) => {
  turnIdentities.value = {
    type: 'user',
    id: value,
    name: option.label,
  }
}

/**
 * 获取转交办理人
 */
const getTurnUser_api = (id: string[], orId: string) => {
  getAllUser_api({
    paging: false,
    sorts: [{ name: 'createTime', order: 'desc' }],
    terms: [{ column: 'id$in-dimension$org', value: id }],
  }).then((res) => {
    turnOptions.value = res.result
      ?.map((i) => ({ label: i.name, value: i.id }))
      ?.filter((i) => i.value !== orId)
  })
}

const onSelectChange = (keys: string[]) => {
  form.processIds = [...keys]
}

const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

const handleSearch = (data) => {
  params.value = data
}

const { loading, run } = useRequest(process_tran, {
  immediate: false,
  onSuccess(resp) {
    if (resp.success) {
      onlyMessage('转办成功')
      emits('update:visible', false)
      emits('refresh')
    }
  },
})

const confirm = () => {
  formRef.value?.validate().then((_data: any) => {
    const params = {
      message: _data.message,
      processIds: _data.processIds,
      original: identities.value[0],
      target: turnIdentities.value,
    }
    run(params)
  })
}

const _query = async (e) => {
  if(!form.original) return []
  const { linkTerms, ...rest } = e
  const resp = await process_list({ query: { ...rest }, linkTerms })
  return {
    result: {
      data: resp.result.data,
      pageIndex: e.pageIndex,
      pageSize: e.pageSize,
      total: resp.result.total,
    },
    status: resp.status,
  }
}
</script>
<style scoped lang="less">
:deep(.ant-form-item-explain, .ant-form-item-extra) {
  color: var(--ant-error-color);
}
:deep(.pro-search) {
  padding-bottom: 0 !important;
  margin-bottom: 0;
  .JSearch-item {
    margin-right: 10px;
    div {
      width: 130px !important;
    }
    .JSearch-item--value {
      div {
        width: 100% !important;
      }
    }
  }
}
</style>
