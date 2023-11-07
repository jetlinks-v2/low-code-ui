<!-- 参数类型输入组件 -->
<template>
  <div class="value-item-warp">
    <TreeSelect v-if="itemType === 'tree-select'" :tree-data="treeData" v-model:value="myValue" style="width: 100%;"
      v-bind="props.componentProps" :disabled="disabled"  @change="onChange"/>
    <Textarea v-else-if="itemType === 'textarea'" v-model:value="myValue" v-bind="props.componentProps"
      :disabled="disabled"  @change="onChange"></Textarea>
    <DatePicker v-else-if="itemType === 'date-picker'" v-bind="props.componentProps" v-model:value="myValue"
      :disabled="disabled" @change="onChange" />
    <TimePicker v-else-if="itemType === 'time-picker'" v-model:value="myValue" v-bind="props.componentProps"
      :disabled="disabled" @change="onChange" />
    <InputNumber v-else-if="itemType === 'input-number'" v-bind="props.componentProps" v-model:value="myValue" allowClear
      :disabled="disabled" @change="onChange" />
    <InputPassword v-else-if="itemType === 'input-password'" allowClear v-bind="props" v-model:value="myValue"
      :disabled="disabled" @change="onChange" />
    <Product v-else-if="itemType === 'product'" v-model:value="myValue" v-bind="props.componentProps" @change="onChange" />
    <Device v-else-if="itemType === 'device'" v-model:value="myValue" v-bind="props.componentProps" @change="onChange" />
    <User v-else-if="itemType === 'user'" v-model:value="myValue" v-bind="props.componentProps" @change="onChange" />
    <Role v-else-if="itemType === 'role'" v-model:value="myValue" v-bind="props.componentProps" @change="onChange" />
    <Org v-else-if="itemType === 'org'" v-model:value="myValue" v-bind="props.componentProps" :disabled="disabled" @change="onChange" />
    <Switch v-else-if="itemType === 'switch'" v-model:checked="myValue" v-bind="props.componentProps" @change="onChange"
      :disabled="disabled"></Switch>
    <Input v-else-if="itemType === 'input'" allowClear v-bind="props.componentProps" type="text" v-model:value="myValue"
      :disabled="disabled" @change="onChange" />
    <Select v-else-if="itemType === 'select' || itemType === 'select-card'" v-bind="props.componentProps" v-model:value="myValue"
      :options="options" :disabled="disabled" @change="onChange" style="width: 100%;" />
    <Upload v-else-if="itemType === 'upload'" :value="myValue" v-bind="props.componentProps" @change="onChange" style="width: 100%;"/>
    <div v-else>--</div>
  </div>
</template>
  
<script setup lang="ts">
import { CSSProperties, PropType } from 'vue'
import Product from '@/components/FormDesigner/components/Components/Product.vue'
import Device from '@/components/FormDesigner/components/Components/Device.vue'
import User from '@/components/FormDesigner/components/Components/User/index.vue'
import Role from '@/components/FormDesigner/components/Components/Role.vue'
import Org from '@/components/FormDesigner/components/Components/Org.vue'
import Upload from './Upload.vue'
import { InputNumber, Input, Textarea, Select, InputPassword, Switch, TreeSelect, DatePicker, TimePicker } from 'jetlinks-ui-components'
import { queryOptions } from '@/components/FormDesigner/utils/utils'
type Emits = {
  (e: 'update:modelValue', data: string | number | boolean): void
  (e: 'change', data: any, item?: any): void
}

interface ItemProps {
  style?: CSSProperties
  class?: string
}

const emit = defineEmits<Emits>()

const props = defineProps({
  // 组件双向绑定的值
  modelValue: {
    type: [Number, String],
    default: '',
  },
  // 组件类型
  itemType: {
    type: String,
    default: () => 'string',
  },
  disabled: Boolean,
  componentProps: Object as PropType<Record<string, any>>
})

const myValue = ref(undefined)
const options = ref<any>([])
const treeData = ref()
const onChange = (e) => {
  if(props.itemType === 'upload'){
    myValue.value = e && e?.length > 0 ? JSON.stringify(e) : null
  }
  emit('update:modelValue', myValue.value)
  emit('change', myValue.value)
}


watch(
  () => props.modelValue,
  () => {
    myValue.value = props.modelValue
  },
  { immediate: true },
)

onMounted(() => {
  if (['select', 'select-card', 'tree-select'].includes(props.itemType)) {
    if (props.componentProps?.treeData) {
      treeData.value = props.componentProps?.treeData
    }
    queryOptions(props.componentProps.source).then(resp => {
      if (['select', 'select-card'].includes(props.itemType)) {
        options.value = resp
      } else {
        treeData.value = resp
      }
    })
  }
})
</script>
  
<style lang="less" scoped>
.value-item-warp{
  overflow: scroll;
  height: 40px;
}
</style>
  