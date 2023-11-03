<!-- 参数类型输入组件 -->
<template>
    <div class="value-item-warp">
      <!-- <j-select
        v-if="itemType === 'select'"
        v-model:value="myValue"
        allowClear
        @change="(_, options) => onChange(options)"
        v-bind="props"
      />
      <j-date-picker
        v-else-if="itemType === 'date'"
        :valueFormat="valueFormat || 'YYYY-MM-DD HH:mm:ss'"
        v-model:value="myValue"
        allowClear
        showTime
        @change="onChange"
      />
      <j-input-number
        v-else-if="itemType === 'inputNumber'"
        v-bind="props"
        v-model:value="myValue"
        allowClear
        @change="onChange"
      />
      <j-input
        allowClear
        v-bind="props"
        v-else-if="itemType === 'object'"
        v-model:value="myValue"
        @change="onChange"
      >
        <template #addonAfter>
          <AIcon type="FormOutlined" @click="modalVisible = true" />
        </template>
      </j-input>
      <GeoComponent
        v-else-if="itemType === 'geoPoint'"
        v-model:point="myValue"
        @change="onChange"
        v-bind="props"
      />
      <j-input-password
        v-else-if="itemType === 'password'"
        allowClear
        v-bind="props"
        type="password"
        v-model:value="myValue"
        @change="onChange"
      /> -->
      <Product v-if="itemType === 'product'" v-model:value="myValue"  v-bind="props" :keys="keys" :mode="mode" @change="onChange"/>
      <Device v-else-if="itemType ==='device'" v-model:value="myValue" v-bind="props" :keys="keys" :mode="mode" @change="onChange"/>
      <User v-else-if="itemType === 'user'" v-model:value="myValue" v-bind="props" :keys="keys" :mode="mode" @change="onChange"/>
      <Role v-else-if="itemType === 'role'" v-model:value="myValue" v-bind="props" :keys="keys" :mode="mode" @change="onChange"/>
      <Org v-else-if="itemType === 'org'" v-model:value="myValue" v-bind="props" :keys="keys" :mode="mode" @change="onChange"/>
      <j-switch v-else-if="itemType === 'switch' " v-model:value="myValue" v-bind="props" @change="onChange"></j-switch>
      <!-- <j-input
        v-else
        allowClear
        v-bind="props"
        type="text"
        v-model:value="myValue"
        @change="onChange"
      /> -->
    </div>
  </template>
  
  <script setup lang="ts">
  import { CSSProperties, PropType } from 'vue'
  import Product from '@/components/FormDesigner/components/Components/Product.vue'
  import Device from '@/components/FormDesigner/components/Components/Device.vue'
  import User from '@/components/FormDesigner/components/Components/User/index.vue'
  import Role from '@/components/FormDesigner/components/Components/Role.vue'
  import Org from '@/components/FormDesigner/components/Components/Org.vue'
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
    // 多选框
    mode: {
      type: String as PropType<'multiple' | 'tags' | 'combobox' | ''>,
      default: '',
    },
    keys:{
        type: Array,
        default:[]
    },
    placeholder: String,
    options: Array, // 下拉选择框下拉数据
    style: Object as PropType<ItemProps['style']>,
    class: String,
    valueFormat: String,
    action: [String, Promise],
    headers: Object,
    disabled:Boolean
  })
  
  const myValue = ref(undefined)
  const onChange = () =>{
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
  </script>
  
  <style lang="less" scoped></style>
  