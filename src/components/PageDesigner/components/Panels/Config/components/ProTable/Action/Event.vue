<template>
  <div>
    <j-button @click="visible = true">配置</j-button>
    <j-modal
        v-model:visible="visible"
        title="配置按钮事件"
        @ok="onSave"
        :width="800"
        @cancel="emits('close')"
    >
      <div style="overflow-y: auto; max-height: 550px">
        <j-form layout="vertical" ref="formRef" :model="formState">
          <j-form-item label="类型" name="type" required>
            <j-radio-group v-model:value="formState.type" button-style="solid">
              <j-radio-button value="confirm">确认框</j-radio-button>
              <j-radio-button value="modal">弹窗</j-radio-button>
              <j-radio-button value="drawer">抽屉</j-radio-button>
            </j-radio-group>
          </j-form-item>
          <template v-if="formState.type !== 'confirm'">
            <j-form-item label="页面类型" name="pageType" required>
              <j-radio-group v-model:value="formState.pageType" @change="onTypeChange">
                <j-radio value="page">页面</j-radio>
                <j-radio value="form">表单</j-radio>
              </j-radio-group>
            </j-form-item>
            <j-form-item
                label="表单选择"
                :validateFirst="true"
                name="pageCode"
                :rules="_rules"
                v-if="formState.pageType === 'form'"
            >
              <j-select
                  allowClear
                  placeholder="请选择"
                  :options="options"
                  v-model:value="formState.pageCode"
                  @change="onDataChange"
              >
              </j-select>
            </j-form-item>
            <j-form-item
                label="页面选择"
                :validateFirst="true"
                name="pageCode"
                :rules="_rules"
                v-else
            >
              <j-select
                  allowClear
                  placeholder="请选择"
                  :options="optionsPage"
                  v-model:value="formState.pageCode"
                  @change="onDataChange"
              >
              </j-select>
            </j-form-item>
            <j-form-item label="页面onMounted" name="mountedCode" required>
              <div>function onCreated(record, axios, route, refs)</div>
              <div style="height: 300px">
                <j-monaco-editor
                    @errorChange="onErrorChange"
                    v-model="formState.mountedCode"
                    language="javascript"
                />
              </div>
            </j-form-item>
          </template>
          <template v-else>
            <j-form-item label="确认文本" name="confirmText" required>
              <j-input placeholder="请输入" v-model:value="formState.confirmText" />
            </j-form-item>
          </template>
          <j-form-item label="确认事件" name="okCode" required>
            <div>{{ formState.type === 'confirm' ? 'function (record, axios, refs)' : 'function (axios, route, refs)' }}}</div>
            <div style="height: 300px">
              <j-monaco-editor
                  @errorChange="onErrorChange"
                  v-model="formState.okCode"
                  language="javascript"
              />
            </div>
          </j-form-item>
        </j-form>
      </div>
    </j-modal>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, watchEffect} from "vue";
import {cloneDeep} from "lodash-es";
import {onlyMessage} from "@jetlinks-web/utils";
import {useTool} from "@LowCode/components/PageDesigner/hooks";

const {getFormList, getPageList} = useTool();
const options = ref<any[]>(getFormList.value || [])
const optionsPage = ref<any[]>(getPageList.value || [])

const props = defineProps({
  value: {
    type: Object,
    default: () => ({
      type: 'confirm',
      okCode: '', // 确认代码
    })
  },
});

const emits = defineEmits(["update:value", "change"]);
const visible = ref<boolean>(false)
const formState = reactive({
  type: 'confirm',
  okCode: '', // 确认代码,
  pageType: 'form',
  mountedCode: '',
  pageData: undefined,
  pageCode: undefined,
  confirmText: ""
});
const formRef = ref<any>();
const _error = ref<any[]>([]);

const _rules = [
  {
    required: true,
    message: "请选择",
  },
  {
    validator(_rule: any, value: string) {
      if (!value) return Promise.resolve();
      if (formState.pageType === 'form') {
        const flag = options.value.find((i) => i.value === value);
        if (!flag) return Promise.reject(`表单已被删除`);
      } else {
        const flag = optionsPage.value.find((i) => i.value === value);
        if (!flag) return Promise.reject(`页面已被删除`);
      }
      return Promise.resolve();
    },
    trigger: "change",
  },
];

const onErrorChange = (error: any[]) => {
  _error.value = error;
};

watchEffect(() => {
  Object.assign(formState, cloneDeep(props.value));
});

const onSave = async () => {
  formRef.value?.validate().then((res: any) => {
    if (res) {
      if (!_error.value?.length) {
        emits("update:value", formState);
        emits("change", formState);
        visible.value = false;
      } else {
        onlyMessage("代码有误，请检查", "error");
      }
    }
  })
}

const onDataChange = (val: any) => {
  if (formState.pageType === 'form') {
    const _dt = (options.value || []).find(i => {
      return i.value === val
    })
    formState.pageData = _dt?.code
  } else {
    const _dt = (optionsPage.value || []).find(i => {
      return i.value === val
    })
    formState.pageData = _dt?.code
  }
}

const onTypeChange = () => {
  formState.pageData = undefined
  formState.pageCode = undefined
}
</script>

