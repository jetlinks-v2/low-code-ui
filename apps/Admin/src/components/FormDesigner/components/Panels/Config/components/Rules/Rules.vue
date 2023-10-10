<template>
  <div class="box">
    <div class="header">
      <j-button type="text" style="padding: 0; margin: 0" @click="onBack">
        <AIcon type="LeftOutlined" style="font-size: 15px" />返回
      </j-button>
    </div>
    <j-form ref="formRef" :model="ruleModel" layout="vertical">
      <j-form-item label="触发类型" name="trigger">
        <j-select
          placeholder="请选择"
          v-model:value="ruleModel.trigger"
          mode="multiple"
          @change="onChange"
        >
          <j-select-option value="blur">失焦时</j-select-option>
          <j-select-option value="change">输入时</j-select-option>
        </j-select>
      </j-form-item>
      <j-form-item name="validator">
        <template #label>
          自定义校验器<j-tooltip title="格式：return 'Error Message'">
            <AIcon type="QuestionCircleOutlined" />
          </j-tooltip>
        </template>
        <EditorBtn
          v-model:value="ruleModel.validator"
          text="编写代码"
          language="javascript"
          @change="onChange"
        />
      </j-form-item>
      <j-form-item label="错误信息" name="message">
        <j-textarea
          placeholder="请输入"
          v-model:value="ruleModel.message"
          @change="onChange"
        />
      </j-form-item>
      <j-form-item label="格式校验" name="pattern">
        <j-select
          placeholder="请选择"
          allowClear
          v-model:value="regRef"
          @change="handleChange"
        >
          <j-select-option
            :key="item.value"
            v-for="item in patternList"
            :value="item.value"
            >{{ item.text }}
          </j-select-option>
        </j-select>
      </j-form-item>
      <j-form-item label="正则表达式" name="pattern">
        <j-textarea
          placeholder="请输入"
          v-model:value="inputRef"
          @change="onPatternChange"
        />
      </j-form-item>
      <j-form-item
        label="最小长度限制"
        name="min"
        v-if="!['date-picker', 'time-picker'].includes(type)"
      >
        <j-input-number
          placeholder="请输入"
          style="width: 100%"
          :precision="0"
          :max="ruleModel.max"
          :min="1"
          v-model:value="ruleModel.min"
          @change="onChange"
        />
      </j-form-item>
      <j-form-item
        label="最大长度限制"
        name="max"
        v-if="!['date-picker', 'time-picker'].includes(type)"
      >
        <j-input-number
          placeholder="请输入"
          style="width: 100%"
          :min="ruleModel.min || 1"
          :precision="0"
          v-model:value="ruleModel.max"
          @change="onChange"
        />
      </j-form-item>
    </j-form>
  </div>
</template>
  
  <script lang="ts" setup>
import { ref, reactive, unref, watchEffect, watch } from 'vue'
import { patternList } from './index'
import EditorBtn from '../EditorBtn.vue'

const props = defineProps({
  value: {
    type: Object,
    default: () => {},
  },
  type: {
    type: String,
    default: 'root',
  },
})
const emits = defineEmits(['change', 'close'])

const formRef = ref<any>()
const ruleModel = reactive<any>({
  message: undefined,
  max: undefined,
  min: undefined,
  // required: false,
  trigger: ['change'],
  pattern: undefined,
  validator: undefined,
})
const regRef = ref<any>(undefined)
const inputRef = ref<any>('')

const handleChange = (e: any) => {
  // const reg = new RegExp(e) // 使用的时候处理
  ruleModel.pattern = e
  emits('change', unref(ruleModel))
}

watch(
  () => inputRef.value,
  (val) => {
    const params = patternList.find((item) => item.value === val)
    if (params) {
      regRef.value = val
    } else {
      regRef.value = undefined
    }
  },
)

watchEffect(() => {
  Object.assign(ruleModel, props.value)
  if (props.value?.pattern) {
    // const reg = `${props.value.pattern}`
    inputRef.value = props.value?.pattern // reg.slice(1, reg.length - 1)
  }
})

const onPatternChange = (e) => {
  ruleModel.pattern = e.target?.value
  emits('change', unref(ruleModel))
}

const onChange = () => {
  emits('change', unref(ruleModel))
}

const onBack = () => {
  emits('change', unref(ruleModel))
    emits('close')
}
</script>
  
  <style scoped lang="less">
.box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  bottom: 0;
  background-color: #fff;
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;

  .header {
    width: 100%;
    border-bottom: 1px solid #f0f0f0;
  }
}
</style>