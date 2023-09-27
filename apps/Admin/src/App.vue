<template>
  <ConfigProvider :locale="zhCN">
    <router-view />
  </ConfigProvider>
</template>
<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'jetlinks-ui-components/es/locale/zh_CN'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
ConfigProvider.config({
  theme: {
    primaryColor: "#315efb"
  }
})
</script>
<style scoped></style>
