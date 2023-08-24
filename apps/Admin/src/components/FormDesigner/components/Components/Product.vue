<template>
  <Iot></Iot>
</template>

<script lang="ts" setup>
import Iot from './iotComponents/index.vue'
import {  provide } from 'vue'
provide('type','product')
</script>
<style lang="less" scoped>
</style>