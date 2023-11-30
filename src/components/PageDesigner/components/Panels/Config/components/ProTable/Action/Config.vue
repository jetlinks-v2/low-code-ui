<template>
  <j-modal
      visible
      title="配置操作列"
      @ok="onSave"
      :width="800"
      @cancel="emits('close')"
  >
    <j-form layout="vertical" ref="formRef" :model="formState">
      <j-form-item label="展示" name="visible">
        <j-switch v-model:checked="formState.visible" @change="onChange"/>
      </j-form-item>
      <template v-if="formState.visible">
        <j-form-item label="操作列宽度" name="width">
          <j-input-number
              :precision="0"
              :min="1"
              addon-after="px"
              placeholder="请输入"
              style="width: 100%"
              v-model:value="formState.width"
          />
        </j-form-item>
        <j-form-item label="操作按钮" name="actions">
          <List ref="tableRef" v-model:value="formState.actions"/>
        </j-form-item>
      </template>
    </j-form>
  </j-modal>
</template>

<script lang="ts" setup>
import {reactive, ref, watchEffect} from "vue";
import {cloneDeep} from "lodash-es";
import List from "./List.vue";
import {onlyMessage} from "@jetlinks-web/utils";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      visible: true,
      width: 200,
      actions: [],
    })
  },
});

const emits = defineEmits(["save", "close"]);
const formState = reactive(props.data);
const tableRef = ref<any>();
const formRef = ref<any>();

watchEffect(() => {
  Object.assign(formState, cloneDeep(props.data));
});

const onChange = (e: boolean) => {
  if(e && !formState?.width) {
    formState.width = 200
  }
}

const onSave = async () => {
  const _table = await tableRef.value?.onSave()
  if(_table && _table?.length){
    formRef.value?.validate().then((res: any) => {
      if (res) {
        console.log(formState)
        emits('save', formState)
      }
    })
  } else {
    onlyMessage('请配置操作按钮', 'error')
  }
}
</script>
  
  