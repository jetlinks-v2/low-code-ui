<template>
  <j-drawer
    visible
    class="custom-class"
    title=""
    :closable="false"
    placement="right"
    @close="emits('update:visible', false)"
    :contentWrapperStyle="{ width: 'auto', minWidth: '50%', maxWidth: '66.6%' }"
  >
    <j-tabs v-model:activeKey="activeKey">
      <j-tab-pane key="form" tab="表单"> 表单页 </j-tab-pane>
      <j-tab-pane key="flow" tab="流程图">流程图</j-tab-pane>
    </j-tabs>
  </j-drawer>
</template>
<script setup lang="ts">
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
}>()

const activeKey = ref<string>('form')
</script>
<style scoped lang="less"></style>
