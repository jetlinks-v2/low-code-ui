<template>
    <div class="header">
        <div class="left">
            <j-space :size="24">
                <span>提供多种方式帮助你快速添加表单页内容</span>
                <j-button type="primary">快速添加</j-button>
                <j-button><AIcon type="SyncOutlined" />同步功能变动</j-button>
            </j-space>
        </div>
        <div class="right"><j-button type="link" @click="emit('preview')">预览</j-button></div>
    </div>
  </template>
  
  <script lang="ts" setup>
  const emit = defineEmits(['preview'])

  </script>

  <style lang="less" scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    height: 50px;
    padding: 0 20px;
    margin-bottom: 1px;
  }
  </style>