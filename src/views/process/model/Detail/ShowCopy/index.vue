<!-- 展示及抄送 -->
<template>
  <div class="page-box">
    <j-form
      class="form-box"
      ref="formRef"
      :model="formData"
      autocomplete="off"
      layout="vertical"
    >
      <TitleComponent data="展示配置" />
      <j-form-item name="variables" label="可用变量">
        <div class="btn">
          <j-button
            style="background-color: #ebedf3; border: none"
            @click="visible = true"
          >
            <AIcon type="PlusOutlined" />
            <span>添加表单字段</span>
          </j-button>
        </div>
        <div
          class="variable-item"
          v-for="(item, index) of _variables"
          :key="index"
          :style="{
            color: item.color,
            border: '1px solid ' + item.color,
            borderRadius: '3px',
            // paddingRight: !item.isOther ? '30px' : '10px',
          }"
        >
          <span>{{ item.label }}</span>
          <AIcon
            class="close"
            type="CloseOutlined"
            :style="{
              color: item.color,

            }"
            v-if="!item.isOther"
            @click="onRemove(item)"
          />
        </div>
        <FormVariables
          v-if="visible"
          v-model:visible="visible"
          v-model:variables="formData.variables"
          :previewData="previewData"
          :treeData="treeData"
        />
      </j-form-item>
      <j-form-item
        name="nameGenerator"
        :rules="[{ required: true, trigger: 'change' }]"
      >
        <template #label>
          <j-space>
            <span>请配置标题模板</span>
            <j-tooltip placement="right">
              <template #title
                >流程开始后所有候选人看到的流程表单名称，如：产品部的采购申请</template
              >
              <AIcon type="InfoCircleOutlined" />
            </j-tooltip>
          </j-space>
        </template>
        <TemplateText
          placeholder="{发起人}的{流程名称}"
          v-model:value="formData.nameGenerator"
          :variables="_variables"
          :maxlength="64"
          name="标题"
          @change="onNameChange"
        />
      </j-form-item>
      <j-form-item
        name="summaryGenerator"
        :rules="[{ required: true, trigger: 'change' }]"
      >
        <template #label>
          <div>
            <span>请配置摘要模板</span>
          </div>
        </template>
        <TemplateText
          placeholder="{请假人}的{请假类型}"
          v-model:value="formData.summaryGenerator"
          :variables="_variables"
          :maxlength="255"
          name="摘要"
          @change="onSummaryChange"
        />
      </j-form-item>
      <TitleComponent data="抄送配置" />
      <j-form-item
        name="ccMember"
        label="配置该流程需要抄送的成员"
        v-if="!noQuery"
      >
        <ConfigureMembers
          :hasWeight="false"
          nodeId="ROOT_1"
          v-model:members="formData.ccMember"
        />
      </j-form-item>
    </j-form>
  </div>
</template>

<script setup lang="ts">
import { queryVariables_api, queryFormNoPage_api } from '@LowCode/api/process/model'
import FormVariables from './components/FormVariables.vue'
import { useFlowStore } from '@LowCode/store/flow'
import { separateData, filterFormVariables } from './utils'
import TemplateText from './components/TemplateText1.vue'
import { TitleComponent, ConfigureMembers } from '@LowCode/components'

const flowStore = useFlowStore()

const props = defineProps({
  noQuery: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: () => ({})
  }
})

// 初始变量
const initVariables = ref<any[]>([])
// 表单树形数据, 用于弹窗左侧数据展示
const treeData = ref<any[]>([])
const previewData = ref<any[]>([])
const visible = ref(false)
const formRef = ref()
// 不用展示的字段类型: 密码框, 上传, 开关, 表格, 内嵌表单
const noShowFieldTypes = ['input-password', 'upload', 'switch', 'table', 'form']

/**
 * 获取变量数据
 * 表单内的变量展示到弹窗
 * 其他变量展示到外面
 */
const getVariables = async () => {
  const { id, name, key, model, provider } = flowStore.modelBaseInfo

  if (!id || props.noQuery) return
  const params = {
    definition: {
      id,
      name,
      key,
      model: JSON.stringify(flowStore.model), // model不能取modelBaseInfo(接口保存才会有值), 直接取动态值flowStore.model
      provider,
    },
    nodeId: flowStore.model.nodes.id || 'ROOT_1', // 展示及抄送直接传根节点id
  }
  const { result } = await queryVariables_api(params)
  console.log('otherFields',result)
  const { formList, otherFields } = separateData(result, {formList: [], otherFields: []})
  //   treeData.value = formList || []
  treeData.value = formList.map(m => {
      m.children = m.children?.filter(f => !noShowFieldTypes.includes(f.others.type) && f.others.required)
      return m
  })?.filter(f => f.children.length)
  console.log('otherFields',otherFields)
  initVariables.value = otherFields || []
  await getFormFields(treeData.value)
}
/**
 * 获取表单字段
 */
const getFormFields = async (data) => {
  if (!data?.length) return
  const params = {
    paging: false,
    terms: [
      {
        column: 'key',
        termType: 'in',
        value: data.map((m) => m.id),
      },
      {
        value: true,
        termType: 'eq',
        type: 'and',
        column: 'latest',
      },
    ],
  }
  const { result } = await queryFormNoPage_api(params)
  previewData.value = result
}

const formData = reactive({
  variables: computed({
    get: () =>
      flowStore.model.config.variables?.length
        ? flowStore.model.config.variables
        : initVariables.value,
    set: (val) => {
      flowStore.model.config.variables = [...initVariables.value, ...val]
    },
  }),
  // nameGenerator: computed({
  //   get: () => formatToName(flowStore.model.config.nameGenerator),
  //   set: (val) => {
  //     flowStore.model.config.nameGenerator = formatToVariable(val)
  //   },
  // }),
  nameGenerator: props.data?.nameGenerator,
  // summaryGenerator: computed({
  //   get: () => formatToName(flowStore.model.config.summaryGenerator),
  //   set: (val) => {
  //     flowStore.model.config.summaryGenerator = formatToVariable(val)
  //   },
  // }),
  summaryGenerator: props.data?.summaryGenerator,
  ccMember: computed({
    get: () => flowStore.model.config.ccMember,
    set: (val) => {
      flowStore.model.config.ccMember = val
    },
  }),
})


watch(() => props.noQuery, () => {
  formData.variables = props.data?.variables?.length ? props.data?.variables : initVariables.value
  formData.nameGenerator = props.data?.nameGenerator
  formData.summaryGenerator = props.data?.summaryGenerator
  formData.ccMember = props.data?.ccMember ?? flowStore.model.config.ccMember
}, { immediate: true })


const _variables = computed(() => {
  return formData.variables.filter(item => {
    if (['process.var.processOwner', 'process.function.processOwnerOrgIds', 'process.function.now'].includes(item.value)) {
      return false
    }
    const keys = item.value.split('.')
    if (keys.some(key => key.includes('form'))) { // 表单变量
      const _id = keys[keys.length - 1]
      return filterFormVariables(previewData.value, _id, item)
    }

    return true
  })
})

const onRemove = (_item: any) => {
  const _index = formData.variables.findIndex(i => i.value === _item.value)
  formData.variables.splice(_index, 1)
}

/**
 * 当前步骤校验方法
 */
const validateSteps = () => {
  return new Promise((resolve, reject) => {
    formRef.value
      .validate()
      .then((res) => {
        // resolve(res)
        resolve(2)
      })
      .catch((err) => {
        // reject(err)
        // 返回当前步骤序号
        reject(2)
      })
  })
}

const onNameChange = (val) => {
  flowStore.model.config.nameGenerator = val
}

const onSummaryChange = (val) => {
  flowStore.model.config.summaryGenerator = val
}

watch(() => props.noQuery, ( val ) => {
  console.log('noQuery', val)
  if (!val) {
    getVariables()
  }
}, { immediate: true })

// onMounted(() => {
//   console.log('otherFields1')
//   getVariables()
//   // validateSteps()
// })

defineExpose({ validateSteps })
</script>

<style lang="less" scoped>
.page-box {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  .form-box {
    width: 50%;
    .variable-item {
      display: inline-block;
      margin-top: 10px;
      margin-right: 5px;
      padding: 2px 10px;
      position: relative;
      .close {
        // position: absolute;
        // right: 3px;
        // top: 6px;
        margin-left: 5px;
      }
    }
  }
}

.btn {
}
</style>
