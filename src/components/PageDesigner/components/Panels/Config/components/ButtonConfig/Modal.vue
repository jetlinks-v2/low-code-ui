<template>
  <div>
    <j-modal
        visible
        title="配置按钮事件"
        @ok="onSave"
        :width="800"
        @cancel="emits('cancel')"
    >
      <div style="overflow-y: auto; max-height: 550px">
        <j-form layout="vertical" ref="formRef" :model="formState">
          <j-form-item label="类型" name="type" required>
            <j-radio-group v-model:value="formState.type" button-style="solid">
              <j-radio-button value="common">普通按钮</j-radio-button>
              <j-radio-button value="confirm">确认框</j-radio-button>
              <j-radio-button value="modal">弹窗</j-radio-button>
              <j-radio-button value="drawer">抽屉</j-radio-button>
            </j-radio-group>
          </j-form-item>
          <template v-if="!['confirm', 'common'].includes(formState.type)">
            <j-form-item required :label="formState?.type === 'modal' ? '弹窗宽度' : '抽屉宽度'" name="width">
              <j-input-number
                  placeholder="请输入"
                  style="width: 100%"
                  :precision="0"
                  :min="520"
                  addon-after="px"
                  v-model:value="formState.width"
              />
            </j-form-item>
            <j-form-item :label="formState?.type === 'modal' ? '弹窗标题' : '抽屉标题'" name="title">
              <j-input
                  placeholder="请输入"
                  v-model:value="formState.title"
              />
            </j-form-item>
            <j-form-item label="是否展示footer" name="footerVisible">
              <j-switch v-model:checked="formState.footerVisible" />
            </j-form-item>
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
                  showSearch
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
            <j-form-item label="页面onCreated" name="createdCode">
              <div>function onCreated({{ okCodeTip }})</div>
              <ProMonaco :tipCode="defaultMountedCode" v-model:value="formState.createdCode" language="javascript" style="height: 300px"/>
            </j-form-item>
          </template>
          <template v-else>
            <j-form-item label="确认文本" name="confirmText" required v-if="['confirm'].includes(formState.type)">
              <j-input placeholder="请输入" v-model:value="formState.confirmText"/>
            </j-form-item>
          </template>
          <j-form-item label="确认事件" name="okCode">
            <div>{{
                ['confirm', 'common'].includes(formState.type) ? `function (${okCodeTip})` : 'function (refs, util, global)'
              }}
            </div>
            <ProMonaco :tipCode="defaultCode" v-model:value="formState.okCode" language="javascript" style="height: 300px" />
          </j-form-item>
          <template v-if="!['confirm', 'common'].includes(formState.type)">
            <j-form-item label="取消事件" name="cancelCode">
              <div>function (refs, util, global)</div>
              <ProMonaco :tipCode="defaultCode" v-model:value="formState.cancelCode" language="javascript" style="height: 300px" />
            </j-form-item>
          </template>
        </j-form>
      </div>
    </j-modal>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, watchEffect} from "vue";
import {cloneDeep} from "lodash-es";
import {useTool} from "@LowCode/components/PageDesigner/hooks";
import {ProMonaco} from "../ProMonaco";

const {getFormList, getPageList} = useTool();
const options = ref<any[]>(getFormList.value || [])
const optionsPage = ref<any[]>(getPageList.value || [])

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String
  }
});

const emits = defineEmits(["cancel", "save"]);

const formState = reactive({
  type: 'common',
  okCode: '', // 确认代码,
  pageType: '',
  width: 520,
  createdCode: '',
  pageData: undefined,
  pageCode: undefined,
  confirmText: "",
  title: "",
  footerVisible: true
});
const formRef = ref<any>();

const defaultCode = `
/**
* @params axios {Axios} 请求实例
* @params route {Object} 路由信息
* @params refs  {Object} 当前组件下的refs
*/
function _fun({ axios, route, refs}){

  /**
  * 接口请求
  * post、postParams、get、patch、remove、put
  */

  axios.post('/instance/_query', { sorts: [{ name: 'createTime', order: 'desc' }] })
  // axios.postParams(url, data, params)
  // axios.get(url, params)
  // axios.patch(url, data)
  // axios.remove(url, params)
  // axios.put(url, data)

  /**
  * 路由信息
  * route.params
  * route.query
  */
  const is = route.params.id

}
`

const defaultMountedCode = `
/**
* @params record {Object} 表格横排数据
* @params axios {Axios} 请求实例
* @params route {Object} 路由信息
* @params refs  {Object} 当前组件下的refs
*/
function onMounted({record, axios, route, refs}){

  /**
  * 接口请求
  * post、postParams、get、patch、remove、put
  */

  axios.post('/instance/_query', { sorts: [{ name: 'createTime', order: 'desc' }] })
  // axios.postParams(url, data, params)
  // axios.get(url, params)
  // axios.patch(url, data)
  // axios.remove(url, params)
  // axios.put(url, data)

  /**
  * 路由信息
  * route.params
  * route.query
  */
  const is = route.params.id

}
`

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

watchEffect(() => {
  Object.assign(formState, cloneDeep(props.value));
});

const okCodeTip = computed(() => {
  return props?.type === 'table' ? 'record, refs, util, global' : 'refs, util, global'
})

const onSave = () => {
  formRef.value?.validate().then((res: any) => {
    if (res) {
      emits("save", formState);
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

