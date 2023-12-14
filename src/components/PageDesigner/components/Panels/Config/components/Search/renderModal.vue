<template>
  <j-modal
      visible
      title="Render配置"
      width="1000px"
      @cancel="cancel"
      @ok="save"
  >
    <span>function render(record, h, components, utils){</span>
    <ProMonaco
        v-model:value="myValue"
        style="height: 500px"
        :tsTip="tsTip"
        :tipCode="tipCode"
    />
    <span>}</span>
  </j-modal>
</template>

<script setup name="RenderModal">
import {ProMonaco} from '../ProMonaco'

const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:value'])

const myValue = ref(props.value)

const tsTip = `
 type RecordType = Record<string, any>

 const record: RecordType
`

const tipCode = `
/**
* render函数
* @params record {object} 行数据
* @params h {Function}
* @params utils {object} 工具类
**/
function render(record, h, utils){
  return record.xxxx // 处理属性

  // 需要特殊处理
  return h(
    'div', // 暂时仅支持Tag、BadgeStatus组件
    {
      style: { color: 'red'}
    },
    record.xxx
  )
}
`

const save = () => {
  emit('save', myValue.value)
}

const cancel = () => {
  emit('cancel')
}
</script>

<style scoped>

</style>
