<template>
  <div class="id-warp">
      <ConfigItem
          v-for="(item, index) in myValue"
          :first="index === 0"
          :last="index === (myValue.length - 1)"
          :index="index"
          :key="item.key"
          :dataId="id"
          :value="item"
          @addRule="addRule"
          @deleteRule="onDelete"
          @change="(d) => { change(d, index) }"
      />
  </div>
</template>

<script setup name="IDConfig">
import ConfigItem from './configItem.vue'
import { addItem } from './util'
import {randomString} from "@jetlinks-web/utils";
import {omit} from "lodash-es";
import { Form } from 'ant-design-vue'

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  },
  id: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['update:value'])

const formItemContext = Form.useInjectFormItemContext()

const myValue = ref((props.value || []).map( item => ({
  ...item,
  key: randomString(6)
})))

const change = (data, index) => {
  myValue.value[index] = data
  const newValue = myValue.value.map(item => omit(item, ['key']))
  emit('update:value', newValue)
  formItemContext.onFieldChange()
}

const onDelete = (index) => {
  myValue.value.splice(index, 1)
  change()
}

const addRule = () => {
  const item = addItem()
  item.key = randomString(6)
  myValue.value.push(item)
  change()
}

// watch(() => props.value, () => {
//   myValue.value =
// }, { immediate: true })

</script>

<style scoped lang="less">
.id-warp {
  padding-top: 4px;

}
</style>
