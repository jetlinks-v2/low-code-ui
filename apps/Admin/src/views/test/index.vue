<script setup lang="ts">
import Repl from '@/components/CustomHTML/Repl.vue'
import { ReplStore } from '@/components/CustomHTML/store'

const store = new ReplStore()
</script>

<template>
  <Repl theme="dark" :store="store" />
</template>

<style lang="less" scoped></style>
