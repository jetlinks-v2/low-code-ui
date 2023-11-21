<template>
  <div>
    <j-modal
      :visible="visible"
      title="数据展示"
      destroyOnClose
      @cancel="handleCancel"
    >
      <template #footer>
        <a-button key="back" @click="handleCancel">关闭</a-button>
      </template>
      <div style="height: 300px;">
        <j-monaco-editor language="json" v-model="value">
      </j-monaco-editor>
      </div>
    </j-modal>
  </div>
</template>
<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  json: {
    type: Object,
    default: () => {},
  },
})

const value = computed(() => {
  return JSON.stringify(props.json)
})
const visible = ref(false)
const emit = defineEmits(['close', 'save'])
const handleCancel = () => {
  emit('close', true)
}
watch(
  () => props.open,
  (val) => {
    visible.value = val
  },
)
</script>
<style scoped>
.content {
  padding: 30px 20px 10px 20px;
}
</style>
