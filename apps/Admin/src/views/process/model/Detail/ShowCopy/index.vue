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
        <div>
          <j-button @click="visible = true">
            <AIcon type="PlusOutlined" />
            <span>表单字段</span>
          </j-button>
        </div>
        <div
          class="variable-item"
          v-for="(item, index) of formData.variables"
          :key="index"
          :style="{
            color: item.color,
            border: '1px solid ' + item.color,
            borderRadius: '3px',
            paddingRight: index > 2 ? '30px' : '10px',
          }"
        >
          <span>{{ item.label }}</span>
          <AIcon
            class="close"
            type="CloseOutlined"
            :style="{
              color: item.color,
            }"
            v-if="
              item.value !== '1' && item.value !== '2' && item.value !== '3'
            "
            @click="formData.variables.splice(index, 1)"
          />
        </div>
        <FormFields
          v-model:visible="visible"
          v-model:variables="formData.variables"
        />
      </j-form-item>
      <j-form-item
        name="nameGenerator"
        :rules="[{ required: true, trigger: 'change' }]"
      >
        <template #label>
          <div>
            <span>请配置标题模板</span>
            <j-tooltip placement="right">
              <template #title
                >流程开始后所有候选人看到的流程表单名称，如：产品部的采购申请</template
              >
              <AIcon type="InfoCircleOutlined" />
            </j-tooltip>
          </div>
        </template>
        <div class="title-template">
          <j-textarea
            v-model:value="formData.nameGenerator"
            placeholder="{发起人}的{流程名称}"
            :auto-size="{ minRows: 4 }"
            :bordered="false"
          />
          <div class="html">
            <span v-html="titleHtml"></span>
          </div>
          <div class="select">
            <j-form-item-rest>
              <j-select
                style="width: 120px; text-align: left"
                placeholder="添加变量"
                :options="formData.variables"
                @select="selectVariable"
              >
              </j-select>
            </j-form-item-rest>
          </div>
        </div>
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
        <div class="title-template">
          <j-textarea
            v-model:value="formData.summaryGenerator"
            placeholder="{请假人}的{请假类型}"
            :auto-size="{ minRows: 4 }"
            :bordered="false"
          />
          <div class="html">
            <span v-html="summaryHtml"></span>
          </div>
          <div class="select">
            <j-form-item-rest>
              <j-select
                style="width: 120px; text-align: left"
                placeholder="添加变量"
                :options="formData.variables"
                @select="selectSummary"
              >
              </j-select>
            </j-form-item-rest>
          </div>
        </div>
      </j-form-item>
      <TitleComponent data="抄送配置" />
      <j-form-item name="ccMember" label="配置该流程需要抄送的成员">
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
import FormFields from '../components/FormFields.vue'
import { useFlowStore } from '@/store/flow'

const flowStore = useFlowStore()

// 固定变量
const fixedVariables = [
  { label: '流程名称', value: '1', color: '#208CFF' },
  { label: '发起人', value: '2', color: '#F7AD1A' },
  { label: '发起人所属组织', value: '3', color: '#EB5B22' },
  //   { label: '111', value: 'process.var', color: '#ddb8ff' },
]
const visible = ref(false)
const formRef = ref()
const formData = reactive({
  variables: computed({
    get: () =>
      flowStore.model.config.variables?.length
        ? flowStore.model.config.variables
        : fixedVariables,
    set: (val) => {
      flowStore.model.config.variables = [...fixedVariables, ...val]
    },
  }),
  nameGenerator: computed({
    get: () => formatToName(flowStore.model.config.nameGenerator),
    set: (val) => {
      flowStore.model.config.nameGenerator = formatToVariable(val)
    },
  }),
  summaryGenerator: computed({
    get: () => formatToName(flowStore.model.config.summaryGenerator),
    set: (val) => {
      flowStore.model.config.summaryGenerator = formatToVariable(val)
    },
  }),
  ccMember: computed({
    get: () => flowStore.model.config.ccMember,
    set: (val) => {
      flowStore.model.config.ccMember = val
    },
  }),
})
watch(
  () => formData.ccMember,
  (val) => {
    console.log('formData.ccMember: ', val)
  },
  {
    deep: true,
  },
)

/**
 * 接收时格式转换, 用于展示:
 * {var:发起人fullId:发起人name}的{var:流程名称fullId:流程名称name}
 * -> {发起人name}的{流程名称name}
 */
const formatToName = (val: string = '') => {
  return val
    .replace(/-/g, '')
    .replace(/\n/g, '<br/>')
    .replace(/\{(.*?)\}/g, ($1, $2) => {
      const _$2 = $2.split(':')
      return `{${_$2[_$2.length - 1]}}`
    })
}

/**
 * 输入时格式转换, 用于保存至接口:
 * {发起人name}的{流程名称name}
 * -> {var:发起人fullId:发起人name}的{var:流程名称fullId:流程名称name}
 */
const formatToVariable = (val: string = '') => {
  return val
    .replace(/\{(.*?)\}/g, ($1, $2) => {
      const variable = formData.variables.filter((item) => item.label === $2)[0]
      return variable ? `{var:${variable.value}:${$2}}` : `{var:${$2}}`
    })
    .replace(/\}(.*?)\{/g, ($1, $2) => {
      // 查找}{中间的内容, 并添加中划线
      return `}-${$2}-{`
    })
}

/**
 * 选中变量
 * @param value
 */
const selectVariable = (_, { label }) => {
  formData.nameGenerator += `{${label}}`
}
const selectSummary = (_, { label }) => {
  formData.summaryGenerator += `{${label}}`
}

// 正则匹配{}中间内容，并替换成<span style="color: 随机颜色"></span>
const replace = (str: string) => {
  return str.replace(/\n/g, '<br/>').replace(/\{(.*?)\}/g, ($1, $2) => {
    return `<span style="color: ${getColor($2)}">${$1}</span>`
  })
}

// 根据选择的变量找出颜色
const getColor = (str: string) => {
  return formData.variables?.filter((item) => item.label === str)[0]?.color
}

// 标题
const titleHtml = computed(() => {
  return replace(formData.nameGenerator || '')
})
// 摘要
const summaryHtml = computed(() => {
  return replace(formData.summaryGenerator || '')
})

/**
 * 保存
 * @param type 默认save 不校验填写内容，submit 提交时校验
 */
// const submit = async (type = 'save') => {
//   // console.log(`output->type`,type)
//   // 仅保存配置数据，不校验填写内容的合规性。
//   if (type !== 'save') {
//     await formRef.value.validate()
//   }
//   return formData
// }

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

defineExpose({ validateSteps })
onMounted(() => {
  validateSteps()
})
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
        position: absolute;
        right: 3px;
        top: 6px;
      }
    }
    .title-template {
      padding: 10px;
      position: relative;
      width: 100%;
      border: 1px solid #d9d9d9;

      .html {
        position: absolute;
        top: 10px;
        left: 10px;
        padding: 4px 11px;
        pointer-events: none;
      }

      .select {
        text-align: end;
      }
    }
  }
}
</style>
