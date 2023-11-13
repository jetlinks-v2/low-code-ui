<!-- 权限控制 -->
<template>
  <j-modal
    visible
    :maskClosable="false"
    title="权限控制"
    width="35%"
    @cancel="emits('update:visible', false)"
    @ok="confirm"
    class="edit-dialog-container"
    cancelText="取消"
    okText="确定"
    :confirmLoading="loading"
  >
    <j-form ref="formRef" :model="form" autocomplete="off">
      <j-form-item name="links" label="">
        <div>配置可以使用该流程的成员</div>
        <ConfigureMembers
          :isNode="false"
          :hasWeight="false"
          :supCancel="false"
          v-model:members="form.links"
        />
      </j-form-item>
    </j-form>
  </j-modal>
</template>
<script setup lang="ts">
import { onlyMessage } from '@jetlinks/utils'
import { useRequest } from '@jetlinks/hooks'
import { getMembers_api, updateMembers_api } from '@/api/process/instance'

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
  visible: {
    type: Boolean,
    default: () => false,
  },
})

const emits = defineEmits<{
  (e: 'update:visible', flag: boolean): void
  (e: 'refresh'): void
}>()

const formRef = ref()
const form = reactive({
  links: [],
})

const { loading, run } = useRequest(updateMembers_api, {
  immediate: false,
  onSuccess(resp) {
    if (resp.success) {
      onlyMessage('操作成功')
      emits('update:visible', false)
      emits('refresh')
    }
  },
})

const confirm = () => {
  formRef.value.validate().then(() => {
    run(props.data.id, form.links)
  })
}
onMounted(() => {
  getMembers_api(props.data.id).then((res) => {
    form.links = res.result.filter(i => i.id !== 'all')
  })
})
</script>
