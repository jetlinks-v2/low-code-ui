<template>
    <Iot></Iot>
  </template>
  
  <script lang="ts" setup>
  import Iot from './iotComponents/index.vue'
  import {  provide } from 'vue'
  provide('type','device')
  </script>
  <style lang="less" scoped>
  </style>