<template>

  <j-drawer
      visible
      title="配置"
      placement="right"
      :style="{ position: 'absolute', zIndex: 1030 }"
      :closable="false"
      :width="520"
      :get-container="WarpRef"
      @close="cancel"
  >
    <j-scrollbar>
      <j-form
          ref="formRef"
          :model="formModel"
          layout="vertical"
      >
        <j-form-item
            label="生成编码"
            required
            :rules="[{ required: true, message: '请选择生成编码'}]"
        >
          <TypeSelect
              v-model:value="mySpecType"
              :options="[
                  { label: '系统随机', value: 'system'},
                  { label: '按规则', value: 'rule'}
              ]"
              @change="change"
          />
        </j-form-item>
        <j-form-item
            v-if="mySpecType === 'rule'"
            label="规则配置"
            name="conditionData"
            required
            :rules="[{ validator: validator }]"
        >
          <Config
              v-model:value="formModel.conditionData"
              :id="props.data?.name"
          />
        </j-form-item>
      </j-form>
    </j-scrollbar>
    <template #footer>
      <j-button style="margin-right: 8px" @click="cancel">取消</j-button>
      <j-button type="primary" @click="save">确定</j-button>
    </template>
  </j-drawer>

</template>

<script setup name="IDModal">
import { WARP_REF} from "@LowCode/components/Database/util";
import {inject} from "vue";
import {addItem, ruleValidator } from './util'
import Config from './config.vue'
import TypeSelect from "./typeSelect.vue";
import {omit} from "lodash-es";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  warp: {
    type: Object
  },
  publish: {
    type: Boolean,
    default: false
  }
})

const formRef = ref()
const WarpRef = inject(WARP_REF)

const emit = defineEmits(['cancel', 'save'])

const formModel = reactive({
  defaultValueSpec: undefined,
  conditionData: props.data.defaultValueSpec?.template?.parts[0].condition.condition,
  ...props.data
})

const mySpecType = computed({
  get() {
    return formModel.conditionData ? 'rule' : 'system'
  },
  set(val) {
    return val
  }
})

const validator = (_, val) => {
  return ruleValidator(val)
}
const cancel = () => {
  emit('cancel')
}

const save = () => {
  formRef.value.validate().then(res => {
    if (res) {

      const conditionData = formModel.conditionData

      const newData = {
        ...props.data,
        ...omit(formModel, ['conditionData'])
      }

      if (conditionData) {
        newData.defaultValueSpec = {
          template: {
            parts: [{
              type: 'condition',
              condition: {
                condition: conditionData
              }
            }]
          }
        }
      } else {
        newData.defaultValueSpec = undefined
      }
      emit('save', newData)
    }
  })
}

const change = (key) => {
  if (key === 'rule') {
    const item = addItem()
    formModel.conditionData = [item]
  } else {
    formModel.conditionData = undefined
  }
}

</script>

<style scoped>

</style>
