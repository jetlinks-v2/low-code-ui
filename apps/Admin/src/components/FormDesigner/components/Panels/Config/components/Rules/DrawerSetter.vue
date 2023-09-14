<template>
  <div>
    <j-button size="small" @click="onClickItem">配置规则</j-button>
    <Teleport to="#config-container">
      <div v-if="visible" class="box">
        <div class="header">
          <j-button
            type="link"
            style="padding: 0; margin: 0"
            @click="onBack"
          >
            <AIcon type="ArrowLeftOutlined" style="font-size: 15px" />返回
          </j-button>
        </div>
        <j-form ref="formRef" :model="ruleModel" layout="vertical">
          <j-form-item label="触发类型" name="trigger">
            <j-select
              placeholder="请选择"
              v-model:value="ruleModel.trigger"
              mode="multiple"
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
            />
          </j-form-item>
          <j-form-item label="错误信息" name="message">
            <j-textarea
              placeholder="请输入"
              v-model:value="ruleModel.message"
            />
          </j-form-item>
          <j-form-item label="格式校验" name="pattern">
            <j-select
              placeholder="请选择"
              v-model:value="regRef"
              @change="handleChange"
            >
              <j-select-option :key="item.value" v-for="item in patternList" :value="item.value"
                >{{ item.text }}
              </j-select-option>
            </j-select>
          </j-form-item>
          <j-form-item label="正则表达式" name="pattern">
            <j-textarea placeholder="请输入" v-model:value="inputRef" />
          </j-form-item>
          <j-form-item label="最小长度限制" name="min" v-if="!['date-picker', 'time-picker'].includes(type)">
            <j-input-number
              placeholder="请输入"
              style="width: 100%"
              v-model:value="ruleModel.min"
            />
          </j-form-item>
          <j-form-item label="最大长度限制" name="max" v-if="!['date-picker', 'time-picker'].includes(type)">
            <j-input-number
              placeholder="请输入"
              style="width: 100%"
              v-model:value="ruleModel.max"
            />
          </j-form-item>
        </j-form>
      </div>
    </Teleport>
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
  index: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: 'root'
  },
})
const emits = defineEmits(['change'])

const visible = ref<boolean>(false)
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
  const reg = new RegExp(e)
  ruleModel.pattern = reg
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
  // console.log('props.value',props.value)
  Object.assign(ruleModel, props.value)
  if (props.value.pattern) {
    const reg = `${props.value.pattern}`
    inputRef.value = reg.slice(1, reg.length - 1)
  }
})

const onClickItem = () => {
  // console.log('ruleModel',ruleModel)
  emits('change', unref(ruleModel), props.index)
  visible.value = true
}

const onBack = () => {
  emits('change', unref(ruleModel), props.index)
  visible.value = false
}
</script>

<style scoped lang="less">
.box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  bottom: 0;
  background: #fff;
  z-index: 10;
  display: flex;
  flex-direction: column;

  .header {
    width: 100%;
    border-bottom: 1px solid #f0f0f0;
  }
}
</style>