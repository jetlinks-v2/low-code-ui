<!-- 流程详情 -->
<template>
  <page-container>
    <j-card style="margin-bottom: 10px">
      <div class="step-box">
        <div class="step">
          <j-steps :current="current">
            <j-step title="基础信息" />
            <j-step title="流程设计" />
            <j-step title="展示及抄送" />
          </j-steps>
        </div>

        <div class="btn">
          <j-button v-if="current > 0" @click="current--">上一步</j-button>
          <j-button v-if="current < 2" @click="handleNext">下一步</j-button>
          <j-button type="primary" @click="handleSave" :loading="saveLoading">
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
          <j-button type="primary" @click="handleDeploy">
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
      <component ref="stepRef" :is="componentsMap[current]" />
    </j-card>
  </page-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BasicInfo from './BasicInfo/index.vue'
import FlowDesign from './FlowDesign/index.vue'
import ShowCopy from './ShowCopy/index.vue'
import { detail_api, update_api, deploy_api } from '@/api/process/model'
import { useFlowStore } from '@/store/flow'
import { onlyMessage } from '@jetlinks/utils'

const flowStore = useFlowStore()
const route = useRoute()
const router = useRouter()

const current = ref(0)
const componentsMap = {
  0: BasicInfo,
  1: FlowDesign,
  2: ShowCopy,
}

/**
 * 获取模型详情
 */
const getFlowDetail = async () => {
  const { result } = await detail_api(route.query.id as string)
  const model = JSON.parse(result.model || '{}')
  //   console.log('model: ', model)

  flowStore.setModel(model)
  flowStore.setModelBaseInfo(result)
}

/**
 * 下一步, 校验当前步骤的数据规范
 */
const stepRef = ref()
const handleNext = () => {
  stepRef.value?.next().then(() => {
    current.value++
  })
}

/**
 * 保存模型数据, 无需校验数据
 */
const saveLoading = ref(false)
const handleSave = () => {
  const params = {
    id: route.query.id,
    state: 'undeployed',
    model: JSON.stringify(flowStore.model),
  }
  console.log('flowStore.model: ', flowStore.model)

  saveLoading.value = true
  update_api(params)
    .then(() => {
      onlyMessage('保存成功', 'success')
      router.go(-1)
    })
    .finally(() => {
      saveLoading.value = false
    })
}

/**
 * 部署, 校验所有步骤数据规范
 */
const handleDeploy = () => {
  //   stepRef.value
  //     ?.validateSteps()
  //     .then((res) => {
  //       console.log('handleDeploy res: ', res)
  //       //   deploy_api(route.query.id as string).then((res) => {
  //       //     if (res.success) {
  //       //       onlyMessage('操作成功')
  //       //     } else {
  //       //       onlyMessage('操作失败', 'error')
  //       //     }
  //       //   })
  //     })
  //     .catch((err) => {
  //       console.log('handleDeploy err: ', err)
  //     })
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
