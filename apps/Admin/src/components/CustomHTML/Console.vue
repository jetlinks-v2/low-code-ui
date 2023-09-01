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
  <div class="message-content">
    <span class="error-message" v-if="!dismissed && error">
      {{ formatMessage(props.error) }}
    </span>
    <span v-else class="runtime-message"> 运行正常</span>
  </div>
</template>

<style lang="less" scoped>
@editor-error-color: rgb(255, 0, 0);
@editor-default-color: rgb(0, 255, 191);
.message-content {
  width: 100%;
  height: 100%;
  padding: 5px;
  background-color: #1e1e1e;
  .error-message {
    color: @editor-error-color;
  }
  .runtime-message {
    color: @editor-default-color;
    &::after {
      overflow: hidden;
      display: inline-block;
      vertical-align: bottom;
      animation: ellipsis 2s infinite;
      content: '\2026';
    }
    @keyframes ellipsis {
      from {
        width: 2px;
      }
      to {
        width: 15px;
      }
    }
  }
}
</style>
