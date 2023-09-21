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
    :destroyOnClose="true"
    @cancel="emit('close', true)"
    @ok="handleSubmit"
  >
    <FormPreview
      :data="data"
      v-if="props.resource.callPage.type === providerEnum.FormPage"
      :mode="mode"
      :value="editValue"
      ref="formPage"
    />
    <CustomHtml
      :code="data || null"
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
import { queryRuntime } from '@/api/form'

const data = ref<any>()

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
    default: '',
  },
  popData: {
    type: Object as PropType<Record<string, any>>,
    default: () => {},
  },
})

const mode = computed(() => {
  if (props.type === 'Add') {
    return 'add'
  } else if (props.type === 'Update') {
    return 'edit'
  }
})

const emit = defineEmits(['close', 'save', 'reload'])
const visible = ref(false)
const confirmLoading = ref(false)
const editValue = ref()

const getInfo = async () => {
  const { projectId, parentId, id } = props.resource.callPage
  const res = await getResource(projectId, parentId, id)
  data.value = res
}

const handleSubmit = async () => {
  const data = await formPage.value.onSave()
  confirmLoading.value = true;
  const params = {
    data,
  }
  if(mode.value == 'edit') {
    params['terms'] = [
      {
        terms: [
          { column: 'id', termType: 'eq', value: props.popData.id }
        ]
      }
    ]
  }
  const res = await queryRuntime(
    props.resource.callPage.projectId,
    props.resource.function,
    props.resource.command,
    params,
  ).finally(() => confirmLoading.value = false)
  emit('reload')
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
watch(
  () => props.popData,
  (val) => {
    console.log(val);
    editValue.value = val
  },
  { immediate: true }
)
</script>
<style lang="less" scoped></style>
