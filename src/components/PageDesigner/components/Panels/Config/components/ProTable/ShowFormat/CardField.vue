<template>
  <div style="margin: 5px 0">
    <j-button @click="onClick" type="link">配置</j-button>
    <j-modal visible title="配置" v-if="visible" @ok="handleOk" @cancel="handleCancel">
      <div>function (record) {</div>
      <div style="height: 300px">
        <j-monaco-editor
            @errorChange="onErrorChange"
            v-model="_value"
            language="javascript"
        />
      </div>
      <div>}</div>
    </j-modal>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {onlyMessage} from "@jetlinks-web/utils";

const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['update:value', 'change'])

const visible = ref<boolean>(false)
const _value = ref<string>(props.value);
const _error = ref<any[]>([]);

const onClick = () => {
  visible.value = true
}

const onErrorChange = (error: any[]) => {
  _error.value = error;
};

const handleOk = () => {
  if (!_error.value?.length) {
    emits("update:value", _value.value);
    emits("change", _value.value);
    visible.value = false;
  } else {
    onlyMessage("代码有误，请检查", "error");
  }
};

const handleCancel = () => {
  visible.value = false;
  _value.value = "";
};

watchEffect(() => {
  _value.value = props?.value; //
});
</script>