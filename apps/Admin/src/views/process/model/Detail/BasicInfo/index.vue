<!-- 基础信息 -->
<template>
  <div class="base-info">
    <div class="form-box">
      <j-form
        ref="formRef"
        :model="formData"
        autocomplete="off"
        layout="vertical"
      >
        <TitleComponent data="表单配置" />
        <j-form-item
          name="forms"
          label="请选择该流程中需要使用的流程表单"
          :rules="[
            {
              required: true,
              validator: rules.checkFormList,
              trigger: 'change',
            },
          ]"
        >
          <ConfigForm ref="configFormRef" v-model:modelValue="formData.forms" />
        </j-form-item>
        <TitleComponent data="权限控制" />
        <j-form-item name="assignedUser" label="配置可以使用该流程的成员">
          <ConfigureMembers
            :isNode="false"
            :hasWeight="false"
            :supCancel="false"
            v-model:members="formData.assignedUser"
          />
        </j-form-item>
      </j-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import ConfigForm from './components/ConfigForm.vue'
import { useFlowStore } from '@/store/flow'

const flowStore = useFlowStore()
const formRef = ref()
const configFormRef = ref()

const getData = (arr: any[]) => {
  return arr.map((i) => {
    return {
      id: i.formItemProps?.name, //字段id
      required: i.formItemProps?.required, //是否必填
      accessModes: ['read'],
      children: getData(i?.children || []),
    }
  })
}

const formToObj = (arr: any[]) => {
  const obj: any = {}
  arr.map((item) => {
    obj[item.formId] = getData(item.fullInfo?.configuration?.children || [])
  })
  return obj
}

const formData = reactive({
  forms: computed({
    get: () => flowStore.model.config.forms || [],
    set: (val) => {
      flowStore.model.config.forms = val
      if (!flowStore.model?.nodes?.props?.formBinds?.length) {
        flowStore.model.nodes.props!.formBinds = formToObj(val)
      }
    },
  }),
  assignedUser: computed({
    get: () => flowStore.model.nodes.props?.assignedUser || [],
    set: (val) => {
      // 基础信心权限控制, 对应根节点的 props.assignedUser, 根节点必然存在 props.assignedUser
      flowStore.model.nodes.props!.assignedUser = val
    },
  }),
})

const rules = {
  checkFormList: async (_rule: any, value: any[]): Promise<any> => {
    if (value?.length === 0) {
      return Promise.reject('请配置表单')
    } else if (value?.every((m) => m.isDelete)) {
      return Promise.reject('所配表单已全部被删除, 请重新选择可用表单')
    } else {
      return Promise.resolve()
    }
  },
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
        resolve(0)
      })
      .catch((err) => {
        // reject(err)
        // 返回当前步骤序号
        reject(0)
      })
  })
}

// 进入页面获取最新表单数据, 判断是否有表单被删除
const getLatestFormList = () => {
  return new Promise((resolve, reject) => {
    configFormRef.value
      .getFormList()
      .then((res) => {
        formData.forms = formData.forms.map((m) => ({
          ...m,
          isDelete: !res.includes(m.formId),
        }))
        resolve(formData.forms)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

defineExpose({ validateSteps, getLatestFormList })

watch(
  () => formData.forms,
  () => {
    formRef.value.validate()
  },
  { deep: true },
)
onMounted(() => {
  validateSteps()
  getLatestFormList()
})
</script>
<style scoped lang="less">
.base-info {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  .form-box {
    width: 50%;
  }
}
</style>
