<!-- 审批节点 -->
<template>
  <Node
    :title="config.name"
    :show-error="showError"
    :content="content"
    :error-info="errorInfo"
    :style="style"
    :active="active"
    @selected="emits('selected')"
    @delNode="emits('delNode')"
    @insertNode="(type) => emits('insertNode', type)"
    placeholder="请设置审批人"
    header-bgc="#FCAB34"
    header-icon="UserOutlined"
  />
</template>

<script setup lang="ts" name="ApprovalNode">
import { computed, ref } from 'vue'
import Node from './Node.vue'
import { useFlowStore } from '@/store/flow'

const flowStore = useFlowStore()

const emits = defineEmits(['selected', 'delNode', 'insertNode'])
const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
})

const showError = ref(false)
const errorInfo = ref('')

const active = computed(() => props?.config?.active)
const style = computed(() => props?.config?.props?.style)
const content = computed(() => {
  const config = props.config.props
  let result: any[] = []
  Object.keys(config.candidates).forEach((key) => {
    if (config.candidates[key].length) {
      result = [...result, ...config.candidates[key]]
    }
  })
  const _names = result.map((item) => item.name)
  return _names.length ? String(_names).replaceAll(',', '、') : '未配置'
})

/**
 * 节点绑定表单字段后, 更改了基础配置的表单
 * 如基础配置删除表单, 则节点表单配置中的formBinds删除对应的表单配置
 */
const updateFormBinds = () => {
  // 基础信息配置的表单
  const basicFormsKeys = flowStore.model.config.forms?.map((m) => m.formId)
  // 基础表单配置更改之前的节点表单配置
  const oldFormBinds = props.config.props.formBinds
  Object.keys(oldFormBinds || {}).forEach((key) => {
    if (!basicFormsKeys?.includes(key)) delete oldFormBinds[key]
  })
}

/**
 * 校验节点
 */
const validate = (err) => {
  const { name } = props.config
  // 节点配置信息校验
  const {
    formBinds,
    candidates,
    completeWeight,
    rejectWeight,
    authButtons,
    endProcessWhenReject,
    gotoWhenReject,
    rejectTo,
    others,
  } = props.config.props
  console.log('others: ', others)
  showError.value = true
  errorInfo.value = '未填写必填配置项'
  if (!name) {
    err.push({
      errors: ['审批节点名称不能为空'],
      name: ['name'],
    })
  } else if (
    !candidates ||
    !Object.keys(candidates).length ||
    Object.values(candidates).every((item: any) => !item.length)
  ) {
    err.push({
      errors: ['请选择可参与审批的候选成员'],
      name: ['candidates'],
    })
  } else if (!completeWeight || !rejectWeight) {
    err.push({
      errors: ['请输入权重'],
      name: ['completeWeight', 'rejectWeight'],
    })
  } else if (!authButtons || !authButtons.length) {
    err.push({
      errors: ['审批成员可以使用哪些按钮'],
      name: ['authButtons'],
    })
    //   } else if (!endProcessWhenReject && !rejectTo) {
  } else if (
    authButtons.includes('reject') &&
    !endProcessWhenReject &&
    (!gotoWhenReject.length || !gotoWhenReject[0])
  ) {
    err.push({
      errors: ['请选择驳回至哪个节点'],
      name: ['gotoWhenReject'],
    })
  } else if (
    candidates &&
    Object.keys(candidates).length &&
    Object.values(candidates).every((item: any) => item?.every((e) => e.isDel))
  ) {
    err.push({
      errors: ['候选人已全部删除'],
      name: ['candidates'],
    })
    errorInfo.value = '候选人已全部删除'
  } else if (name.length > 64) {
    err.push({
      errors: ['审批节点名称最多输入64个字符'],
      name: ['name'],
    })
    errorInfo.value = '配置项错误'
  }
  // 表单默认勾选"读"权限, 此处不做校验
  //   else if (!formBinds || !Object.keys(formBinds).length) {
  //     err.push({
  //       errors: ['请确认当前节点需要候选人办理的表单内容'],
  //       name: ['formBinds'],
  //     })
  //   }
  else if (others.defaultComment?.length > 64) {
    err.push({
      errors: ['审批意见默认值最多输入64个字符'],
      name: ['others', 'defaultComment'],
    })
    errorInfo.value = '配置项错误'
  } else {
    showError.value = false
    errorInfo.value = ''
  }
}

defineExpose({ validate })
onMounted(() => {
  updateFormBinds()
})
</script>

<style scoped></style>
