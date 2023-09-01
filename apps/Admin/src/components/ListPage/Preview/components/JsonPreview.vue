<template>
  <div>
    <j-modal :visible="visible" @cancel="handleCancel">
      <template #footer>
        <a-button key="back" @click="handleCancel">关闭</a-button>
      </template>
      <div class="content">
        {{ props.json }}
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
  padding: 30px 20px 10px 20px
}
</style>
