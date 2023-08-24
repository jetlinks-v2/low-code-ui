<template>
  <div>
    <p>配置后会在该配置项名称后方展示</p>
    <j-form-item :name="['componentProps', 'description']" label="说明内容">
      <j-textarea :rows="2" :maxlength="100" placeholder="请输入100字以内文字" v-model:value="target.componentProps.description" />
    </j-form-item>
  </div>
</template>
    
<script lang="ts" setup>
import { useTarget } from '../../../../hooks'

const { target } = useTarget()
</script>