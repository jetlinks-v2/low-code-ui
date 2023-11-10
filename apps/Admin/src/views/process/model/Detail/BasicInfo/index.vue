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
import { cloneDeep } from 'lodash-es'
import { advancedComponents } from '../FlowDesign/components/const'
import {
  handleFormList,
  setDefaultFormBinds,
} from '../FlowDesign/components/utils'
import ConfigForm from './components/ConfigForm.vue'
import { useFlowStore } from '@/store/flow'

const flowStore = useFlowStore()
const formRef = ref()
const configFormRef = ref()

// const getData = (arr: any[]) => {
//   return arr.map((i) => {
//     return {
//       id: i.formItemProps?.name, //字段id
//       required: i.formItemProps?.required, //是否必填
//       accessModes: ['read'],
//       children: getData(i?.children || []),
//     }
//   })
// }

// const formToObj = (arr: any[]) => {
//   const obj: any = {}
//   arr.map((item) => {
//     obj[item.formId] = getData(item.fullInfo?.configuration?.children || [])
//   })
//   return obj
// }

const formData = reactive({
  forms: computed({
    get: () => flowStore.model.config.forms || [],
    set: (val) => {
      flowStore.model.config.forms = val
      // 设置根节点默认的表单配置, 以供条件节点, 成员选择和展示抄送页面的变量查询
      //   flowStore.model.nodes.props!.formBinds = setDefaultFormBinds(
      //     handleFormList(val.map((i) => i.fullInfo)),
      //     flowStore.model.nodes.props!.formBinds,
      //   )
      // @ts-ignore
      //   if (!Object.keys(flowStore.model?.nodes?.props?.formBinds)?.length) {
      //     flowStore.model.nodes.props!.formBinds = formToObj(val)
      //   }
      // 表单配置改变, 更新每个节点的表单配置
      nodeLoop(
        handleFormList(val.map((i) => i.fullInfo)),
        flowStore.model.nodes,
      )
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
 * 递归遍历每个节点
 * @param forms 基础信息配置的表单信息
 * @param node 节点
 */
const nodeLoop = (forms, node) => {
  if (['ROOT', 'APPROVAL', 'DEAL'].includes(node.type))
    updateNodesFormBinds(forms, node)
  if (node.branches?.length) {
    for (let i = 0; i < node.branches.length; i++) {
      nodeLoop(forms, node.branches[i])
    }
  }
  if (node.children && Object.keys(node.children).length) {
    nodeLoop(forms, node.children)
  }
}

/**
 * 更新每个节点的表单配置
 * @param forms 基础信息配置的表单信息
 * @param node 节点
 */
const updateNodesFormBinds = (forms, node) => {
  // 清空原有数据之前, 固定的表单配置, 用于回显读写勾选状态
  const _fixedFormBinds = cloneDeep(node.props.formBinds)
  // 清空原有数据, 根据最新的表单配置, 更新节点的表单配置
  node.props.formBinds = {}
  forms?.forEach((item) => {
    node.props.formBinds[item.key] = []
    item.flattenFields?.forEach((p) => {
      // 处理单选高级组件, 平铺keys至formBinds
      if (
        !(
          p.componentProps.hasOwnProperty('mode') &&
          p.componentProps.mode === 'multiple'
        ) &&
        advancedComponents.includes(p.type)
      ) {
        // 高级组件, 并且为单选模式时, 将componentProps.keys平铺存入formBinds
        p.componentProps.keys?.forEach((k) => {
          node.props.formBinds[item.key].push({
            id: k.config.source,
            required: p.formItemProps.required,
            // accessModes: p.accessModes,
            accessModes: _fixedFormBinds
              ? _fixedFormBinds[item.key]?.find(
                  (f) => f.id === p.formItemProps.name,
                )?.accessModes || ['read']
              : ['read'],
            ownerBy: p.formItemProps.name, // key所属高级组件, 用于回显
          })
        })
      } else {
        node.props.formBinds[item.key].push({
          id: p.formItemProps.name,
          required: p.formItemProps.required,
          accessModes: _fixedFormBinds
            ? _fixedFormBinds[item.key]?.find(
                (f) => f.id === p.formItemProps.name,
              )?.accessModes || ['read']
            : ['read'],
        })
      }
    })
  })
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
        formData.forms = formData.forms.map((m) => {
          const row = res.find((k) => k.key === m.formId)
          return {
            ...m,
            formName: row?.name || m.formName,
            fullInfo: row || m,
            isDelete: !row,
            // isDelete: !res.includes(m.formId),
          }
        })
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
