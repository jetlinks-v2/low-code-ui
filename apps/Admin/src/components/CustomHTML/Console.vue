<script setup lang="ts">
import { CompilerError } from 'vue/compiler-sfc'

const props = defineProps<{
  error: Error | string
}>()

const dismissed = ref(false)

watch(
  () => props.error,
  () => {
    dismissed.value = false
  },
)

function formatMessage(err: string | Error): string {
  if (typeof err === 'string') {
    return err
  } else {
    let msg = err.message
    const loc = (err as CompilerError).loc
    if (loc && loc.start) {
      msg = `(${loc.start.line}:${loc.start.column}) ` + msg
    }
    return msg
  }
}
</script>

<template>
  <div class="error-content">
    <span class="message" v-if="!dismissed && error">
      {{ formatMessage(props.error) }}
    </span>
  </div>
</template>

<style lang="less" scoped>
@editor-text-default: rgb(255, 0, 0);
.error-content {
  width: 100%;
  height: 100%;
  padding: 5px;
  background-color: #1e1e1e;
  .message {
    color: @editor-text-default;
  }
}
</style>
