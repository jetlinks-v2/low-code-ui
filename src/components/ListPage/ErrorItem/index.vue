<template>
  <div class="error-item" ref="errorItemRef">
    <div :class="{'error-border': !!errorData && border}">
      <slot></slot>
    </div>
    <p class="error-message" v-if="errorData?.message">{{ errorData.message }}</p>
  </div>
</template>

<script setup lang="ts" name="ErrorItem">
import { PropType } from 'vue';

const props = defineProps({
  errorData: {
    type: Object as PropType<Record<string, any>>,
    default: () => {}
  },
  border: {
    type: Boolean,
    default: true
  },
})

const errorItemRef = ref()

onMounted(() => {
  console.log(errorItemRef.value.child);
})
</script>

<style scoped lang="less">
  .error-item {
    width: 100%;
    height: 100%;
    .error-border {
      border: 1px solid red;
    }
    .error-message{
      color: red;
      margin: 0;
      font-size: 13px;
    }
  }
</style>