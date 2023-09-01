<template>
  <div class="error-item" ref="errorItemRef">
    <div :class="{'error-border': !!errorData}">
      <slot></slot>
    </div>
    <p class="error-message" v-if="errorData?.message">{{ errorData.message }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  errorData: {
    type: Object,
    default: () => {}
  }
})

const errorItemRef = ref()

onMounted(() => {
  console.log(errorItemRef.value.child);
})
const message = computed(() => {
  console.log(props.errorData);
})
</script>

<style scoped lang="less">
  .error-item {
    width: 100%;
    .error-border {
      border: 1px solid red;
    }
    .error-message{
      color: red;
    }
  }
</style>