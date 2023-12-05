<template>
  <div style="margin: 5px 0">
    <j-button @click="onClick" type="link">配置</j-button>
    <j-modal :width="800" visible title="配置" v-if="visible" @ok="handleOk" @cancel="handleCancel">
      <div>function (record, util)</div>
      <ProMonaco :tipCode="defaultCode" v-model:value="_value" language="javascript" style="height: 300px"/>
    </j-modal>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {ProMonaco} from "../../ProMonaco";

const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['update:value', 'change'])

const visible = ref<boolean>(false)
const _value = ref<string>(props.value);

const defaultCode = `
/**
* @params context {record} 表格横排的数据
*/
// key为需要显示的数据的key
return record?.key
`

const onClick = () => {
  visible.value = true
}

const handleOk = () => {
  emits("update:value", _value.value);
  emits("change", _value.value);
  visible.value = false;
};

const handleCancel = () => {
  visible.value = false;
  _value.value = "";
};

watchEffect(() => {
  _value.value = props?.value; //
});
</script>