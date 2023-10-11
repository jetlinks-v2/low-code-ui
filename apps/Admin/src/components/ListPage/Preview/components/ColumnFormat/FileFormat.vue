<template>
  <template v-if="!isEmpty(value)">
    <span v-if="config?.fileValue === 'url'">{{ formatValue }}</span>
    <template v-else-if="config?.fileValue === 'icon'">
      <Image
        :preview="{ visible: false }"
        :src="formatValue.split(',')?.[0]"
        height="100px"
        width="100px"
        style="object-fit: cover"
        @click="visible = true"
      />
      <div style="display: none">
        <j-image-preview-group
          :preview="{ visible, onVisibleChange: (vis) => (visible = vis) }"
        >
          <Image v-for="item in formatValue.split(',')" :src="item" />
        </j-image-preview-group>
      </div>
    </template>
    <span v-if="config?.fileValue === 'fileName'">{{ formatValue }}</span>
  </template>
  <span v-else>--</span>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { isEmpty } from '../../../utils'
import Image from '@/components/Image/index.vue'

const visible = ref(false)

const props = defineProps({
  config: {
    type: Object as PropType<Record<string, any>>,
    default: () => {},
  },
  value: {
    type: String,
    default: '',
  },
})

/**
 * 文件格式化
 */
const formatFn = (value) => {
  console.log(value)
  if (isEmpty(value)) {
    return '--'
  }
  try {
    let result = value
    value = typeof value == 'string' ? JSON.parse(value) : value
    switch (true) {
      case ['url', 'icon'].includes(props.config?.fileValue):
        result = value
          .map((item) => {
            return item.url
          })
          .join(',')
        break
      case props.config?.fileValue === 'fileName':
        result = value
          .map((item) => {
            return item.name
          })
          .join(',')
        break
    }
    return result
  } catch (error) {
    return '--'
  }
}

const formatValue = computed(() => {
  return formatFn(props.value)
})
</script>
<style scoped lang="less">
:deep(.ant-image-img) {
  object-fit: cover;
}
</style>
