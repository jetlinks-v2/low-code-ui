<template>
  <!--新增-->
  <j-modal
    :maskClosable="false"
    :visible="visible"
    :confirm-loading="confirmLoading"
    title=""
    okText="确定"
    cancelText="取消"
    width="630px"
    @cancel="emit('close', true)"
    @ok="handleSubmit"
  >
    <FormPreview
      :data="data"
      v-if="props.resource.callPage.type === providerEnum.FormPage"
      :mode="mode"
      ref="formPage"
    />
    <CustomHtml
      :code="JSON.stringify(data)"
      v-else-if="props.resource.callPage.type === providerEnum.HtmlPage"
    />
  </j-modal>
</template>
<script setup lang="ts">
import { FormPreview } from '@/components/FormDesigner'
import CustomHtml from '@/components/CustomHTML/output/Preview.vue'
import { PropType } from 'vue'
import { getResource } from '@/api/basis'
import { providerEnum } from '@/components/ProJect'
import { ReplStore } from '@/components/CustomHTML/store'
import { useProduct } from '@/store'
import { queryRuntime } from '@/api/form'

const data = ref<Record<string, any>>()

const productStore = useProduct()
const vueMode = ref(true)
const store = new ReplStore(JSON.stringify(data.value))
const formPage = ref()
provide('store', store)
provide('useVueMode', vueMode)
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  resource: {
    type: Object as PropType<Record<string, any>>,
    default: () => {},
  },
  type: {
    type: String,
    default: ''
  }
})

const mode = computed(() => {
  if(props.type === 'Add') {
    return 'add'
  } else if(props.type === 'Update') {
    return 'edit'
  }
})

const emit = defineEmits(['close', 'save'])
const visible = ref(false)
const confirmLoading = ref(false)

const getInfo = async () => {
  const { projectId, parentId, id } = props.resource.callPage
  const res = await getResource(projectId, parentId, id)
  data.value = res
}

const handleSubmit = async () => {
  formPage.value.onSave()
  const res = await queryRuntime(props.resource.callPage.projectId, props.resource.function, props.resource.command, data)
  emit('close', true)
}

watch(
  () => JSON.stringify(props.resource.callPage),
  () => {
    getInfo()
  },
)

watch(
  () => props.open,
  (val) => {
    visible.value = val
  },
)


watch(() => props.type, () => {

})
</script>
<style lang="less" scoped></style>
