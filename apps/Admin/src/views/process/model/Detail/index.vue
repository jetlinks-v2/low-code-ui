<!-- 流程详情 -->
<template>
  <page-container>
    <j-card style="margin-bottom: 10px">
      <div class="step-box">
        <div class="step">
          <j-steps v-model:current="current">
            <j-step title="基础信息" />
            <j-step title="流程设计" />
            <j-step title="展示及抄送" />
          </j-steps>
        </div>

        <div class="btn">
          <j-button v-if="current > 0" @click="current--">上一步</j-button>
          <j-button v-if="current < 2" @click="current++">下一步</j-button>
          <j-button type="primary" @click="save">
            保存
            <template #icon>
              <j-tooltip placement="right">
                <template #title>
                  仅保存配置数据，不校验填写内容的合规性。
                </template>
                <AIcon type="QuestionCircleOutlined" />
              </j-tooltip>
            </template>
          </j-button>
          <j-button type="primary">
            部署
            <template #icon>
              <j-tooltip placement="right">
                <template #title> 配置内容需要通过合规性校验。 </template>
                <AIcon type="QuestionCircleOutlined" />
              </j-tooltip>
            </template>
          </j-button>
        </div>
      </div>
    </j-card>
    <j-card>
      <component :is="componentsMap[current]" />
    </j-card>
  </page-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BasicInfo from './BasicInfo/index.vue'
import FlowDesign from './FlowDesign/index.vue'
import ShowCopy from './ShowCopy/index.vue'
import { detail_api, update_api } from '@/api/process/model'
import { useFlowStore } from '@/store/flow'

const flowStore = useFlowStore()
const current = ref(0)
const componentsMap = {
  0: BasicInfo,
  1: FlowDesign,
  2: ShowCopy,
}
const route = useRoute()

/**
 * 获取模型详情
 */
const getFlowDetail = async () => {
  const { result } = await detail_api(route.query.id as string)

  const model = JSON.parse(result.model || '{}')
  console.log('model: ', model)
}

/**
 * 保存模型数据
 */
const save = () => {
  console.log('save: ', flowStore.model)
}

onMounted(() => {
  getFlowDetail()
})
</script>

<style lang="less" scoped>
.step-box {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  .step {
    flex: 1;
  }
  .btn {
    width: 350px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>
