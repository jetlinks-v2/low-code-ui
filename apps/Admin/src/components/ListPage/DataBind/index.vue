<template>
  <div class="data-bind">
    <j-form layout="inline">
      <j-form-item label="数据绑定">
        <j-select style="width: 200px"></j-select>
      </j-form-item>
      <j-form-item>
        <j-select style="width: 200px"></j-select>
      </j-form-item>
      <j-form-item>
        <j-button type="link">变更</j-button>
      </j-form-item>
      <j-form-item>
        <j-button type="link">校验</j-button>
      </j-form-item>
      <j-form-item v-if="!open">
        <j-button @click="emits('update:open', true)">操作向导</j-button>
      </j-form-item>
    </j-form>
  </div>
</template>

<script setup lang="ts" name="DataBind">

interface Emit {
  (e: 'update:open', value: boolean): void
}

const emits = defineEmits<Emit>()
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  }
})

</script>

<style scoped lang="less">
.data-bind {
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 1px 4px #0015291f;
}
</style>
