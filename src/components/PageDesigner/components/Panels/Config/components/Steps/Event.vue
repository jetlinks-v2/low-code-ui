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
      <div>function (refs, util, global)</div>
      <ProMonaco :tipCode="defaultCode" v-model:value="_value" language="javascript" style="height: 300px" />
    </j-modal>
  </div>
</template>

<script lang="ts" setup>
import {ref, watchEffect} from "vue";
import {ProMonaco} from "../ProMonaco";

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
});

const emits = defineEmits(["update:value"]);
const visible = ref<boolean>(false)

const _value = ref<any>(props.value || '');

watchEffect(() => {
  _value.value = props.value
});

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
const onSave = async () => {
  emits("update:value", _value.value);
  visible.value = false;
}
</script>

