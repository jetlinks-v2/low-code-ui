<template>
  <!--新增-->
  <j-modal
    :maskClosable="false"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :title="popTitle"
    :width="modalWidth"
    okText="确定"
    cancelText="取消"
    @cancel="emit('close', true)"
    @ok="emit('close', true)"
  >
    <FormPreview
      :data="JSON.parse(data)"
      :project-id="projectId"
      v-if="props.resource.type === providerEnum.FormPage"
      mode="add"
    />
    <CustomHtml
      :code="data"
      v-else-if="props.resource.type === providerEnum.HtmlPage"
    />
  </j-modal>
</template>
<script setup lang="ts">
import { FormPreview } from '@LowCode/components'
import CustomHtml from '@LowCode/components/CustomHTML/output/Preview.vue'
import { PropType } from 'vue'
import { providerEnum } from '@LowCode/components/ProJect'
import { ReplStore } from '@LowCode/components/CustomHTML/store'
import { useProduct } from '@LowCode/store'

const data = ref<string>('')

const productStore = useProduct()

const modalWidth = computed(() => {
  if(props.resource.modalWidth) {
    return props.resource.modalWidth + props.resource.modalWidthUnit
  } else {
    return '520px'
  }
})
const vueMode = ref(true)
const store = new ReplStore(JSON.stringify(data.value))
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
  popTitle: {
    type: String,
    default: '',
  },
  projectId: {
    type: String,
    default: '',
  }
})
const emit = defineEmits(['close', 'save'])
const visible = ref(false)
const confirmLoading = ref(false)

const getInfo = async () => {
  const { projectId, parentId, id } = props.resource
  // const res = await getResource(projectId, parentId, id)
  // data.value = res
  const res = productStore.getById(id)
  data.value = res?.configuration?.code
  console.log(data.value)
}

watch(
  () => JSON.stringify(props.resource),
  () => {
    console.log(props.resource)
    getInfo()
  },
)

watch(
  () => props.open,
  (val) => {
    console.log(val, 'val')

    visible.value = val
  },
)
</script>
<style lang="less" scoped></style>
