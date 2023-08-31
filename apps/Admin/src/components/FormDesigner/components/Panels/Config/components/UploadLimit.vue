<template>
  <div>
    <j-form-item required :name="['componentProps', 'accept']" label="格式">
      <j-select
        mode="multiple"
        placeholder="请选择"
        v-model:value="target.componentProps.accept"
      >
        <j-select-option v-for="item in list" :value="item">{{ item }}</j-select-option>
      </j-select>
    </j-form-item>
    <j-form-item required :name="['componentProps', 'fileSize']" label="单个大小">
      <j-input-group compact>
        <j-input-number
          style="width: 60%"
          v-model:value="target.componentProps.fileSize"
          :min="0"
        />
        <j-select
          :defaultValue="'M'"
          style="width: 40%"
          v-model:value="target.componentProps.unit"
        >
          <j-select-option value="M">M</j-select-option>
          <j-select-option value="KB">KB</j-select-option>
        </j-select>
      </j-input-group>
    </j-form-item>
  </div>
</template>
      
<script lang="ts" setup>
import { useTarget } from '../../../../hooks'

const { target } = useTarget()

const textType = ['.xlsx','.xls','.csv','.zip','.json']
const imgType = ['.jpg','.png','.jpeg']

const list = computed(()=>target.value.componentProps?.listType === 'text'?textType:imgType)

</script>