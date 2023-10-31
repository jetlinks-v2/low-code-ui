<template>
  <div>
    <j-button size="small" @click="onClickItem">配置规则</j-button>
    <!-- <Teleport to="#config-container"> -->
    <!-- 这个Teleport 不知道为什么要报错-->
    <!-- <Rules
        v-if="visible"
        :value="value"
        :index="index"
        :type="type"
        @change="onChange"
        @close="onBack"
      /> -->
    <!-- </Teleport> -->
  </div>
</template>

<script lang="ts" setup>
import { inject, watch } from 'vue'

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
    default: 'root',
  },
})
const emits = defineEmits(['change'])

const __rules: any = inject('__rules')

const onClickItem = () => {
  __rules.visible.value = true
  __rules.data.value = props.value
  __rules.data.type = props.type
  __rules.data.index = props.index
}

watch(
  () => __rules.data,
  (newVal) => {
    if(props.index === newVal?.index){
      emits('change', newVal.value, props.index)
    }
  },
  {
    deep: true,
  },
)
</script>

<style scoped lang="less">
</style>