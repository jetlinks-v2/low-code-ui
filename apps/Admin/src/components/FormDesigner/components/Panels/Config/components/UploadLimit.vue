<template>
  <div>
    <j-form-item required :name="['componentProps', 'accept']" label="格式">
      <j-select mode="multiple" placeholder="请选择" v-model:value="target.componentProps.accept">
        <j-select-option value=".jpg">.jpg</j-select-option>
      </j-select>
    </j-form-item>
    <j-form-item required :name="['componentProps', 'size']" label="单个大小">
      <j-input-group compact>
        <j-input-number style="width: 60%" v-model:value="target.componentProps.size" />
        <j-select :defaultValue="'M'" style="width: 40%" v-model:value="target.componentProps.unit">
          <j-select-option value="M">M</j-select-option>
        </j-select>
      </j-input-group>
    </j-form-item>
  </div>
</template>
      
<script lang="ts" setup>
import { useTarget } from '../../../../hooks'

const { target } = useTarget()
</script>