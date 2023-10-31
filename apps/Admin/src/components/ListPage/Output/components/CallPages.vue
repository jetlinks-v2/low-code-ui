<template>
  <!--新增-->
  <j-modal
    :maskClosable="false"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :title="title"
    okText="确定"
    cancelText="取消"
    :width="modalWidth"
    :destroyOnClose="true"
    @cancel="emit('close', true)"
    @ok="handleSubmit"
  >
    <FormPreview
      v-if="props.resource.callPage.type === providerEnum.FormPage"
      :data="data"
      :mode="mode"
      :value="editValue"
      :projectId="projectId"
      ref="formPage"
    />
    <CustomHtml
      :code="data || null"
      v-else-if="props.resource.callPage.type === providerEnum.HtmlPage && data"
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
import { clone, cloneDeep } from 'lodash-es'

const data = ref<any>()

const vueMode = ref(true)
const store = new ReplStore(JSON.stringify(data.value))
const modalWidth = computed(() => {
  if (props.resource.modalWidth) {
    return props.resource.modalWidth + props.resource.modalWidthUnit
  } else {
    return '520px'
  }
})
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
  dataColumns: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  projectId: {
    type: String,
    default: '',
  },
})

const mode = computed(() => {
  if (props.type === 'Add') {
    return 'add'
  } else if (props.type === 'Update' || props.type === 'Detail') {
    return 'edit'
  }
})

const title = computed(() => {
  if (props.type === 'Detail') {
    return '查看详情'
  } else if (mode.value === 'add') {
    return '新增'
  } else if (mode.value === 'edit') {
    return '编辑'
  }
})

const emit = defineEmits(['close', 'save', 'reload'])
const visible = ref(false)
const confirmLoading = ref(false)
const editValue = ref()

const getInfo = async () => {
  data.value = null
  const { projectId, parentId, id } = props.resource.callPage
  const res = await getResource(projectId, parentId, id)
  data.value = res
}

const handleSubmit = async () => {
  if (!['Add', 'Update'].includes(props.type)) {
    emit('close', true)
    return
  }
  let data = {}
  if (props.resource.callPage.type === providerEnum.FormPage) {
    data = await formPage.value.onSave()
  } else {
    data =
      (<any>document.getElementById('previewFrame'))?.contentWindow?.onSave?.() ||
      {}
  }
  confirmLoading.value = true
  const params = {
    data,
  }
  if (mode.value == 'edit') {
    params['terms'] = [
      {
        terms: [{ column: 'id', termType: 'eq', value: props.popData.id }],
      },
    ]
  }
  const res = await queryRuntime(
    props.resource.callPage.projectId,
    props.resource.function,
    props.resource.command,
    params,
  ).finally(() => (confirmLoading.value = false))
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

watchEffect(() => {
  if (props.type !== 'Add' && visible.value) {
    editValue.value = {}
    for (const key in props.popData) {
      const result = props.dataColumns.find((item) => item.dataIndex === key)
      if (result && result.config?.type === 'enum') {
        editValue.value[key] = cloneDeep(
          Array.isArray(props.popData[key])
            ? props.popData?.[key]?.map((item) => item.value)
            : props.popData?.[key]?.value,
        )
      } else {
        editValue.value[key] = cloneDeep(props.popData[key])
      }
    }
  } else {
    editValue.value = {}
  }
  window.addEventListener('message', (e) => {
    if(e.data === 'loaded') {
      (<any>document.getElementById('previewFrame')).contentWindow.postMessage(JSON.stringify(editValue.value))
    }
  })
})
</script>
<style lang="less" scoped></style>
