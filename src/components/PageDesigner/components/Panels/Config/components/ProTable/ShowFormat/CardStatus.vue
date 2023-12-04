<template>
  <div>
    <j-button @click="onClick" type="link" size="small">配置</j-button>
    <j-modal :width="800" visible title="配置" v-if="visible" @ok="handleOk" @cancel="handleCancel">
      <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
        <j-form-item label="数据展示方式" name="showStatus" required>
          <j-switch v-model:checked="modelRef.showStatus"/>
        </j-form-item>
        <template v-if="modelRef.showStatus">
          <j-form-item
              required
              label="状态文本"
              name="statusText"
          >
            <j-input prefix="record." v-model:value="modelRef.statusText"/>
          </j-form-item>
          <j-form-item
              required
              label="状态值"
              name="status"
          >
            <j-input prefix="record." v-model:value="modelRef.status"/>
          </j-form-item>
          <j-form-item
              required
              label="状态的颜色值"
              name="statusColor"
          >
            <j-row :gutter="24">
              <j-col :span="14">
                <div style="height: 300px">
                  <j-monaco-editor
                      @errorChange="onErrorChange"
                      v-model="modelRef.statusColor"
                      key="card-status-1"
                      language="json"
                  />
                </div>
              </j-col>
              <j-col :span="10">
                <div style="height: 300px">
                  <j-monaco-editor
                      :modelValue="statusJson"
                      key="card-status-2"
                      language="json"
                      readOnly
                  />
                </div>
              </j-col>
            </j-row>
          </j-form-item>
        </template>
      </j-form>
    </j-modal>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {onlyMessage} from "@jetlinks-web/utils";
import {cloneDeep} from "lodash-es";

const props = defineProps({
  value: {
    type: Object,
    default: () => {
      showStatus: false
    }
  }
})
const emits = defineEmits(['update:value', 'change'])

const visible = ref<boolean>(false)
const _error = ref<any[]>([]);
const statusJson = `
{
  "default": "102, 102, 102",
  "processing": "9, 46, 231",
  "error": "229, 0, 18",
  "success": "36, 178, 118",
  "warning": "255, 144, 0"
}
`
const formRef = ref();

const modelRef = reactive({
  showStatus: false,
  status: '',
  statusText: '',
  statusColor: ''
});

watchEffect(() => {
  Object.assign(modelRef, cloneDeep(props?.value))
});
const onClick = () => {
  visible.value = true
}

const onErrorChange = (error: any[]) => {
  _error.value = error;
};

const handleOk = () => {
  formRef.value.validate().then((res: any) => {
    if (res) {
      if (!_error.value?.length) {
        emits("update:value", modelRef);
        emits("change", modelRef);
        visible.value = false;
      } else {
        onlyMessage("代码有误，请检查", "error");
      }
    }
  })
};

const handleCancel = () => {
  visible.value = false;
};
</script>