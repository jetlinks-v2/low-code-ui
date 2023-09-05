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
    @ok="emit('close', true)"
  >
    <FormPreview :data="data" v-if="props.resource.type === providerEnum.FormPage" mode="add"/>
    <CustomHtml :code="JSON.stringify(data)" v-else-if="props.resource.type === providerEnum.HtmlPage"/>
  </j-modal>
</template>
<script setup lang="ts">
import { FormPreview } from '@/components/FormDesigner';
import CustomHtml from '@/components/CustomHTML/output/Preview.vue'
import { PropType } from 'vue';
import { getResource } from '@/api/basis'
import { providerEnum } from '@/components/ProJect';

const data = ref<Record<string, any>>()
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  resource: {
    type: Object as PropType<Record<string, any>>,
    default: () => {}
  }
})
const emit = defineEmits(['close', 'save'])
const visible = ref(false)
const confirmLoading = ref(false)

const getInfo = async () => {
  const { projectId, parentId, id } = props.resource
  const res = await getResource(projectId, parentId, id)
  data.value = res
}

watch(() => JSON.stringify(props.resource), () => {
  console.log(data);
  getInfo()
})

watch(
  () => props.open,
  (val) => {
    console.log(val, 'val')

    visible.value = val
  },
)
</script>
<style lang="less" scoped></style>
