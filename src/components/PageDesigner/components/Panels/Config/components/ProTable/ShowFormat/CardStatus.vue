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
            <ProMonaco :tipCode="statusJson" v-model:value="modelRef.statusColor" language="json" style="height: 300px"/>
          </j-form-item>
        </template>
      </j-form>
    </j-modal>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {cloneDeep} from "lodash-es";
import {ProMonaco} from "../../ProMonaco";

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

const handleOk = () => {
  formRef.value.validate().then((res: any) => {
    if (res) {
      emits("update:value", modelRef);
      emits("change", modelRef);
      visible.value = false;
    }
  })
};

const handleCancel = () => {
  visible.value = false;
};
</script>