<template>
  <div class="release-status">
    <div class="status-tree">
      <div class="status-result">
        总共 {{ source.length }} 条
        <span v-if="check.type === 'loading'">
         ，已校验 {{ check.progress }} 条，未校验 {{ check.wait }} 条
        </span>
        <span v-if="check.type === 'end'">
         ，已校验 {{ check.progress }} 条，正常 {{ check.success }} 条，失败 {{ check.fail }} 条
        </span>
      </div>
      <div class="status-source">
        <j-scrollbar>
          <div class="source-item" v-for="item in source" :key="item.id">
            <div class="source-item-title">
              {{ item.name }}
            </div>
            <div class="source-item-status">

            </div>
          </div>
        </j-scrollbar>
      </div>
    </div>
    <div class="status-theme">
      <div>
        主题色
      </div>
      <a-select
        v-model:value="theme"
        option-label-prop="label"
        :options="options"
        style="width: 100%"
      >
        <template #option="{ value, label }">
          <div style="display: flex;gap: 24px;" >
            <div :style="{ width: '24px', height: '24px', backgroundColor: value}"></div>
            {{ label }}
          </div>

        </template>
      </a-select>
    </div>
  </div>
</template>

<script setup name="ReleaseStatus">
import { useEngine, useProduct } from '@/store'

const props = defineProps({
  theme: {
    type: String,
    default: '#2f54eb'
  }
})

const engine = useEngine()
const product = useProduct()

const options = [
  { label: '薄暮', value: '#f5222d' },
  { label: '火山', value: '#fa541c' },
  { label: '日暮', value: '#fa8c16' },
  { label: '金盏花', value: '#faad14' },
  { label: '日出', value: '#fadb14' },
  { label: '青柠', value: '#a0d911' },
  { label: '极光绿', value: '#52c41a' },
  { label: '明青', value: '#13c2c2' },
  { label: '拂晓蓝', value: '#1677ff' },
  { label: '极客蓝', value: '#2f54eb' },
  { label: '酱紫', value: '#722ed1' },
  { label: '法式洋红', value: '#eb2f96' },
]

const theme = ref('#2f54eb')

const check = reactive({
  success: 0,
  fail: 0,
  progress: 0,
  wait: 0,
  type: 'loading'
})

const source = ref([])

/**
 * 获取内部资源
 */
const getResource = () => {
  const _map = product.getDataMap()
  const list = [..._map.values()].filter(item => !!item.others.menu)
  source.value = list.map(item => ({ ...item, isCheck: 0}))
  startCheck()
}

/**
 * 开始校验
 */
const startCheck = () => {

}

getResource()

</script>

<style scoped lang="less">
.release-status {
  display: flex;
  height: 100%;
  gap: 24px;

  .status-tree {
    height: 100%;
    flex: 1 1 auto;

    .status-result {
      height: 40px;
      margin-bottom: 12px;
    }

    .status-source {
      height: calc(100% - 40px);

      .source-item {
        padding: 8px 0;
      }
    }
  }

  .status-theme {
    width: 300px;
  }

}
</style>
