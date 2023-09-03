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
    <div
      style="
        width: 100%;
        padding: 20px;
        height: 500px;
        text-align: center;
        line-height: 500px;
      "
    >
      展示调用页面内容
    </div>
  </j-modal>
</template>
<script setup lang="ts">
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['close', 'save'])
const visible = ref(false)
const confirmLoading = ref(false)
watch(
  () => props.open,
  (val) => {
    console.log(val, 'val')

    visible.value = val
  },
)
</script>
<style lang="less" scoped></style>
