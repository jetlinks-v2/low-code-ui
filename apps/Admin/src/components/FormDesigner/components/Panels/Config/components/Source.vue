<template>
  <div>
    <p>请配置可选项的数据来源</p>
    <j-radio-group button-style="solid" style="margin-bottom: 24px">
      <j-radio-button :value="true">数据字典</j-radio-button>
      <j-radio-button :value="false">后端接口</j-radio-button>
    </j-radio-group>
    <j-form-item>
      <j-select placeholder="请选择" />
    </j-form-item>
    <j-form-item label="数据层级"  
        :rules="[
          {
            required: true,
            message: '请输入',
          },
        ]">
      <j-select placeholder="请选择" />
    </j-form-item>
    <j-form-item label="展示字段" 
        :rules="[
          {
            required: true,
            message: '请输入',
          },
        ]">
      <j-select placeholder="请选择"  />
    </j-form-item>
    <j-form-item label="存入后端字段" 
        :rules="[
          {
            required: true,
            message: '请输入',
          },
        ]">
      <j-select placeholder="请选择" />
    </j-form-item>
  </div>
</template>
    
<script lang="ts" setup>
import { useTarget } from "../../../../hooks"

const { target } = useTarget()
</script>