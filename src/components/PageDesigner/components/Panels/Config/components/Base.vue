<template>
  <div>123</div>
</template>

<script lang="ts" setup>
import { useTarget } from '../../../../hooks'

const { target } = useTarget()

const emits = defineEmits(['refresh'])
</script>

<style lang="less" scoped>
</style>