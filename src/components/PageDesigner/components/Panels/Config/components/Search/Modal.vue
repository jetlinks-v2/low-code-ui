<template>
  <div>
    <j-button type="dashed" shape="round" @click="onBtn">
      配置
    </j-button>
    <j-modal
        v-model:visible="visible"
        title="配置"
        :width="800"
        @ok="handleOk"
        @cancel="handleCancel"
    >
      <j-form layout="vertical" ref="formRef" :model="formState">
        <j-form-item label="类型" name="type" required>
          <j-radio-group v-model:value="formState.type" button-style="solid" @change="onChange">
            <j-radio-button value="dic">数据字典</j-radio-button>
            <j-radio-button value="static">静态数据</j-radio-button>
            <j-radio-button value="dynamic">动态数据</j-radio-button>
          </j-radio-group>
        </j-form-item>
        <j-form-item
            name="dictionary"
            label="数据字典"
            :rules="rulesDic"
            v-if="formState.type === 'dic'"
        >
          <j-select
              placeholder="请选择"
              v-model:value="formState.dictionary"
              showSearch
          >
            <j-select-option
                :label="item.name"
                v-for="item in dic || []"
                :key="item.id"
                :value="item.id"
            >
              {{ item.name }}
            </j-select-option>
          </j-select>
        </j-form-item>
        <j-form-item label="静态数据" name="optionsJson" required v-if="formState.type === 'static'">
          <ProMonaco :tipCode="defaultJson" v-model:value="formState.optionsJson" language="json" style="height: 300px"/>
        </j-form-item>
        <template v-if="formState.type === 'dynamic'">
          <dataSourceConfig ref="dataRef" :value="formState.optionsData"/>
        </template>
      </j-form>
    </j-modal>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive} from "vue";
import dataSourceConfig from '../DataSource/dataSourceConfig.vue'
import {onlyMessage} from "@jetlinks-web/utils";
import {cloneDeep} from "lodash-es";
import {ProMonaco} from "../ProMonaco";
import {queryDictionary} from "@LowCode/api/form";

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  },
});

const emits = defineEmits(["update:value", "change"]);
const visible = ref<boolean>(false);

const defaultJson = `
[
  {
    "label": "数据1",
    "value": "num1"
  },
  {
    "label": "数据2",
    "value": "num2"
  },
  {
    "label": "数据3",
    "value": "num3"
  }
]
`

const onBtn = () => {
  visible.value = true;
};

const formState = reactive({
  type: 'dic',
  optionsJson: '',
  optionsData: {},
  dictionary: undefined
});

const formRef = ref<any>();
const dataRef = ref<any>();
const dic = ref<any[]>([])

const onChange = () => {
  formState.optionsJson = ''
  formState.optionsData = {}
}

const getDictionary = async () => {
  const resp = await queryDictionary()
  if (resp.success) {
    // 过滤掉没有启用的数据
    dic.value = resp.result?.filter((item: any) => item?.status) || []
  }
}

const rulesDic = [
  {
    required: true,
    message: '请选择',
  },
  {
    async validator(_rule: any, value: string) {
      if(!value) return Promise.resolve()
      const item = dic.value?.find((i) => i?.id === value)
      if (!item) {
        return Promise.reject(`数据字典已被删除或禁用`)
      }
      return Promise.resolve()
    },
    trigger: 'change',
  },
]

const handleOk = async () => {
  const resp = await formRef.value?.validate()
  if (resp) {
    let obj = {...formState}
    if (formState.type === 'dynamic' ) {
      const res = await dataRef.value?.onSave()
      if (resp && res.query) {
        obj = {
          ...formState,
          optionsData: res
        }
      } else {
        onlyMessage("请配置数据源", "error");
        return
      }
    }
    emits("update:value", obj);
    emits("change", obj);
    visible.value = false;
  }
};

const handleCancel = () => {
  visible.value = false;
};

watchEffect(() => {
  Object.assign(formState, cloneDeep(props.value))
})

getDictionary()
</script>
