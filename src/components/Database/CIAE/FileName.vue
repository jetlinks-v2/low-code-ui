<template>
  <div class="file-name">
    <div class="file-input">
      <j-input
          v-model:value="fileName"
          placeholder="请输入文件名"
          @change="change"
      />
    </div>
    <span>_yyyy_MM_dd_HH_mm_ss.xlsx</span>
  </div>
</template>

<script setup name="FileName">

const props = defineProps({
  value: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['update:value'])

const fileName = ref(props.value)

const change = (e) => {
  emit('update:value', e.target.value)
}
</script>

<style scoped lang="less">
.file-name {
  display: flex;
  gap: 4px;
  line-height: 30px;

  .file-input {
    flex: 1;
  }
}
</style>
