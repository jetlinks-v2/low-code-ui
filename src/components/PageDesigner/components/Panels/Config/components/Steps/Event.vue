<template>
  <div>
    <j-button @click="visible = true">配置</j-button>
    <j-modal
        v-model:visible="visible"
        title="配置按钮事件"
        @ok="onSave"
        :width="800"
        @cancel="visible = false"
    >
      <div>function (axios, route, refs)</div>
      <div style="height: 300px">
        <j-monaco-editor
            @errorChange="onErrorChange"
            v-model="_value"
            language="javascript"
        />
      </div>
    </j-modal>
  </div>
</template>

<script lang="ts" setup>
import {ref, watchEffect} from "vue";
import {onlyMessage} from "@jetlinks-web/utils";

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
});

const emits = defineEmits(["update:value"]);
const visible = ref<boolean>(false)

const _value = ref<any>(props.value || '');
const _error = ref<any[]>([]);

const onErrorChange = (error: any[]) => {
  _error.value = error;
};

watchEffect(() => {
  _value.value = props.value
});

const onSave = async () => {
  if (!_error.value?.length) {
    emits("update:value", _value.value);
    visible.value = false;
  } else {
    onlyMessage("代码有误，请检查", "error");
  }
}
</script>

