
<template>
  <j-modal visible  :width="500"  @cancel="emit('close')" @ok="emit('save')">
      确定删除
    </j-modal>
</template>

<script setup lang='ts' name="ToastModal">

type Emits = {
    (e: 'save'): void;
    (e: 'close'): void
};
const emit = defineEmits<Emits>();

</script>

<style scoped lang='less'>

</style>