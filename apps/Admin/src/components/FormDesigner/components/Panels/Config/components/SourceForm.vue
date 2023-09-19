<template>
  <div>
    <j-form-item
      label="数据绑定"
      :validateFirst="true"
      :name="['componentProps', 'source', 'value']"
      :rules="[
          {
            required: true,
            message: '请选择',
          },
        ]"
    >
      <j-select
        allowClear
        placeholder="请选择"
        :options="options"
        v-model:value="target.componentProps.source.value"
        @change="onDataChange"
      >
      </j-select>
    </j-form-item>
  </div>
</template>

<script setup name="SourceForm">
import { useTarget } from '../../../../hooks'
import { useProduct } from '@/store'
import {providerEnum} from "@/components/ProJect";

const options = ref([])
const project = useProduct()
const { target } = useTarget()

const FormDesigner = inject('FormDesigner')

const emits = defineEmits(['refresh'])
const getFormList = () => {
  const list = project.getDataMapByType(providerEnum.FormPage)
  //   过滤掉自身
  const filterList = list.filter(item => item.id !== FormDesigner.tabsId)
  options.value = filterList.map(item => {
    return {
      label: item.title,
      value: item.id,
      code: item.configuration?.code
    }
  })
}

const onDataChange = (e, node) => {
  target.value.componentProps.source.code = node?.code
  emits('refresh', target.value)
}

getFormList()

</script>

<style scoped>

</style>
