<template>
  <!-- 导出 -->
  <j-modal
    :maskClosable="false"
    :visible="visible"
    title="导出"
    okText="确定"
    cancelText="取消"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div style="margin-top: 10px">
      <j-space>
        <span>文件格式：</span>
        <j-radio-group
          v-model:value="type"
          placeholder="请选择文件格式"
          button-style="solid"
        >
          <j-radio-button value="xlsx">xlsx</j-radio-button>
          <j-radio-button value="csv">csv</j-radio-button>
        </j-radio-group>
      </j-space>
    </div>
  </j-modal>
  <j-modal :visible="progressVisible" :closable="false" :footer="null">
    <h3>正在导出</h3>

    <div style="display: flex">
      <j-progress
        style="width: 500px"
        :percent="percent"
        :show-info="false"
        :stroke-color="{
          '0%': '#87d068',
          '100%': '#87d068',
        }"
      />

      <p style="margin-left: 10px">12</p>
    </div>
  </j-modal>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { useTransition } from '@vueuse/core'
const emit = defineEmits(['close'])

const props = defineProps({
  data: {
    type: Array,
    default: [],
  },
  open: {
    type: Boolean,
    default: false,
  },
})
const progressVisible = ref(false)
const baseNumber = ref(0)
const type = ref<string>('xlsx')
const visible = ref(false)
const percent = useTransition(baseNumber, {
  duration: 1500,
  transition: [0.75, 0, 0.25, 1],
})
const handleOk = () => {
  progressVisible.value = true
  emit('close')
  baseNumber.value = 100
}

const handleCancel = () => {
  emit('close')
}
watch(
  () => props.open,
  (val) => {
    visible.value = val
    type.value = 'xlsx'
  },
  { immediate: true },
)
watch(
  () => percent.value === 100,
  (val) => {
    if (val) {
      message.success('导出成功')
      baseNumber.value = baseNumber.value === 100 ? 0 : 100
      progressVisible.value = false
    }
  },
)
</script>

<style scoped lang="less">
.track {
  background: rgba(125, 125, 125, 0.3);
  border-radius: 0.5rem;
  max-width: 20rem;
  width: 100%;
}

.sled {
  background: var(--vp-c-brand);
  border-radius: 50%;
  height: 1rem;
  position: absolute;
  width: 1rem;
}

.number.track {
  height: 1rem;
  margin: 0.5rem 0;
  padding: 0 0.5rem;
}

.number.track .sled {
  transform: translateX(-50%);
}

.vector.track {
  padding: 0.5rem;
}

.vector.track .relative {
  padding-bottom: 30%;
}

.vector.track .sled {
  transform: translateX(-50%) translateY(-50%);
}
</style>
