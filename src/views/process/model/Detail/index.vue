<!-- 流程详情 -->
<template>
  <page-container>
    <j-card style="margin-bottom: 10px">
      <div class="step-box">
        <div class="step">
          <j-steps :current="current">
            <j-step :status="stepStatus[0]" title="基础信息">
              <template #icon v-if="validLoading">
                <AIcon type="LoadingOutlined" />
              </template>
            </j-step>
            <j-step :status="stepStatus[1]" title="流程设计">
              <template #icon v-if="validLoading">
                <AIcon type="LoadingOutlined" />
              </template>
            </j-step>
            <j-step :status="stepStatus[2]" title="展示及抄送">
              <template #icon v-if="validLoading">
                <AIcon type="LoadingOutlined" />
              </template>
            </j-step>
          </j-steps>
        </div>

        <div class="btn">
          <j-button :disabled="current === 0" @click="current--"
            >上一步</j-button
          >
          <j-button
            :disabled="current === 2"
            @click="handleNext"
            :loading="nextLoading"
            >下一步</j-button
          >
          <PermissionButton
            type="primary"
            @click="handleSave"
            :loading="saveLoading"
            hasPermission="process/model:save"
          >
            保存
            <template #icon>
              <j-tooltip placement="right">
                <template #title>
                  仅保存配置数据，不校验填写内容的合规性。
                </template>
                <AIcon type="QuestionCircleOutlined" />
              </j-tooltip>
            </template>
          </PermissionButton>
          <PermissionButton
            type="primary"
            @click="handleDeploy"
            hasPermission="process/model:deploy"
            :disabled="!isChange && flowDetail?.state?.value === 'deployed'"
            :loading="deployLoading"
          >
            部署
            <template #icon>
              <j-tooltip placement="right">
                <template #title> 配置内容需要通过合规性校验。 </template>
                <AIcon type="QuestionCircleOutlined" />
              </j-tooltip>
            </template>
          </PermissionButton>
        </div>
      </div>
    </j-card>
    <FullPage :minHeight="current !== 1">
      <!--      <j-card :bordered="false">-->
      <!--        <component ref="stepRef" :is="componentsMap[current]" />-->
      <!--      </j-card>-->
      <div style="height: 100%; padding: 24px">
<!--        <component :key="current" ref="stepRef" :is="componentsMap[current]" />-->
        <BasicInfo v-show="current === 0" key="step11" ref="step1" />
        <FlowDesign v-show="current === 1" key="step12" ref="step2" />
        <ShowCopy v-show="current === 2" key="step13" ref="step3" :data="flowStore.model.config" :noQuery="current !== 2" />
      </div>
    </FullPage>

    <!-- 隐藏域, 仅用于部署校验每一步数据, noQuery: 不查询接口 -->
<!--    <div class="validate-box">-->
<!--      <BasicInfo key="step1" ref="step1" />-->
<!--      <FlowDesign key="step2" ref="step2" />-->
<!--      <ShowCopy key="step3" ref="step3" :noQuery="true" />-->
<!--    </div>-->

    <j-modal
      v-model:visible="visible"
      :width="300"
      @cancel="onCancel"
      @ok="onOk"
      :closable="false"
      :maskClosable="false"
    >
      <template #footer>
        <PermissionButton
          @click="onCancel"
          :hasPermission="true"
          style="margin-right: 12px"
        >
          不保存
        </PermissionButton>
        <PermissionButton
          type="primary"
          @click="onOk"
          hasPermission="process/model:save"
        >
          保存
        </PermissionButton>
      </template>
      <div class="model-content">页面改动数据未保存</div>
    </j-modal>
    <SaveDialog
      v-if="dialog.visible"
      v-model:visible="dialog.visible"
      :data="dialog.selectItem"
      :isDeploy="true"
      @refresh="refresh"
      @cancel="cancel"
    />
  </page-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BasicInfo from './BasicInfo/index.vue'
import FlowDesign from './FlowDesign/index.vue'
import ShowCopy from './ShowCopy/index.vue'
import { detail_api, update_api, deploy_api } from '@LowCode/api/process/model'
import { onlyMessage, LocalStore } from '@jetlinks-web/utils'
import { useFlowStore, defaultModel } from '@LowCode/store/flow'
import { cloneDeep } from 'lodash-es'
import { TOKEN_KEY } from '@jetlinks-web/constants'
import {setEmptyNodeProps} from "@LowCode/views/process/model/Detail/FlowDesign/components/utils";
import SaveDialog from '../Dialog/index.vue'

const flowStore = useFlowStore()
const route = useRoute()
const router = useRouter()

const dialog = reactive({
  selectItem: {},
  isDeploy: false,
  visible: false,
})

const current = ref(0)
// 每个步骤的状态
const stepStatus = ref(['', '', ''])
const componentsMap = {
  0: BasicInfo,
  1: FlowDesign,
  2: ShowCopy,
}
const stepRef = ref()
const step1 = ref()
const step2 = ref()
const step3 = ref()
const nextLoading = ref(false)
const saveLoading = ref(false)
const deployLoading = ref(false)
const isModal = ref(false)
const visible = ref(false)
let routerNext
const oldData = ref(defaultModel)
/**
 * 获取模型详情
 */
const flowDetail = ref<any>({})
const getFlowDetail = async () => {
  const { result } = await detail_api(route.query.id as string)
  flowDetail.value = result
  const model = JSON.parse(result.model || '{}')
  console.log('model: ', model)
  if (result.model !== '') {
    oldData.value = cloneDeep(model)
  }

  flowStore.setModel(cloneDeep(model))
  flowStore.setModelBaseInfo(result)
}

/**
 * 下一步, 校验当前步骤的数据规范
 */
const handleNext = async () => {
  // 点击下一步先保存数据, 再校验->#19300
  //   handleSave('next') #19300 恢复之前交互 下一步不保存数据
  // 从基础信息点击下一步前, 查询最新表单, 验证已选表单是否被全部删除
  await step1.value.getLatestFormList()
  if (current.value === 0) {
    await step1.value.memberSubmit()
  }
  let _stepRef = step1.value
  // 触发校验
  if (current.value === 1) {
    _stepRef = step2.value
  }

  _stepRef
    ?.validateSteps('next')
    .then(() => {
      // 校验通过, 对应步骤恢复正常状态, 并进入下一步骤
      stepStatus.value[current.value] = ''
      current.value++
    })
    .catch(() => {
      // 步骤校验失败, 返回的当前步骤序号, 直接将对应步骤标红提示
      console.log('111111111111111111111111111111')
      stepStatus.value[current.value] = 'error'
    })
}

/**
 * 保存模型数据, 无需校验数据
 */
const handleSave = (type?: string) => {
  // 保存流程图截图
  step2.value?.setBase64()
  step1.value.getLatestFormList().then(() => {
    setEmptyNodeProps(flowStore.model.nodes)
    const params = {
      id: route.query.id,
      state: !isChange.value ? flowDetail.value?.state?.value : 'undeployed',
      model: JSON.stringify(flowStore.model),
    }
    if (type !== 'next') {
      saveLoading.value = true
    } else {
      nextLoading.value = true
    }
    update_api(params)
      .then(() => {
        if (type !== 'next') {
          onlyMessage('保存成功', 'success')
          isModal.value = true
          router.go(-1)
        }
        //   getFlowDetail() #19297 此处调用详情会报错闪一下
      })
      .finally(() => {
        saveLoading.value = false
        nextLoading.value = false
      })
  })
}

/**
 * 部署, 校验所有步骤数据规范
 */
const validLoading = ref(false)
const handleDeploy = async () => {
  deployLoading.value = true
  // 部署前, 查询表单是否被删除
  step1.value.getLatestFormList().then((res) => {
    validLoading.value = true

    Promise.allSettled([
      step1.value?.validateSteps(),
      step2.value?.validateSteps(),
      step3.value?.validateSteps(),
    ])
      .then(async (valid) => {
        //   console.log('handleDeploy valid: ', valid)
        // 添加加载中动画, 适当给个延时
        setTimeout(() => {
          valid?.forEach((item, index) => {
            if (item.status === 'fulfilled') {
              stepStatus.value[index] = ''
            }
            if (item.status === 'rejected') {
              stepStatus.value[index] = 'error'
            }
          })
          validLoading.value = false
        }, 500)

        if (
          Array.isArray(valid) &&
          valid.every((item) => item.status === 'fulfilled')
        ) {
          // 所有步骤验证通过, 开始部署
          dialog.selectItem = flowDetail.value
          dialog.selectItem.model = JSON.stringify(flowStore.model)
          dialog.selectItem.state = !isChange.value ? flowDetail.value?.state?.value : 'undeployed'
          dialog.visible = true
          dialog.isDeploy = true
          // saveAndDeploy()
        } else {
          onlyMessage('部署失败，流程配置内容不合规', 'error')
          deployLoading.value = false
        }
      })
      .catch((err) => {
        //   console.log('handleDeploy err: ', err)
        deployLoading.value = false
          onlyMessage('部署失败，流程配置内容不合规', 'error')
      })
  })
}

const refresh = () => {
  saveAndDeploy()
}
/**
 * 保存数据并部署
 */
const saveAndDeploy = () => {
  setEmptyNodeProps(flowStore.model.nodes)
  deployLoading.value = true
  deploy_api(route.query.id as string).then((res) => {
    if (res.success) {
      onlyMessage('部署成功', 'success')
      isModal.value = true
      router.go(-1)
    } else {
      onlyMessage('部署失败', 'error')
    }
  }).finally(() => {
    deployLoading.value = false
  })
  // const params = {
  //   id: route.query.id,
  //   state: !isChange.value ? flowDetail.value?.state?.value : 'undeployed',
  //   model: JSON.stringify(flowStore.model),
  // }
  // deployLoading.value = true
  // update_api(params)
  //   .then(() => {
  //     deploy_api(route.query.id as string).then((res) => {
  //       if (res.success) {
  //         onlyMessage('部署成功', 'success')
  //         isModal.value = true
  //         router.go(-1)
  //       } else {
  //         onlyMessage('部署失败', 'error')
  //       }
  //     })
  //   })
  //   .finally(() => {
  //     deployLoading.value = false
  //   })
}

const onOk = async () => {
  // 保存流程图截图
  step2.value?.setBase64()
  const params = {
    id: route.query.id,
    state: 'undeployed',
    model: JSON.stringify(flowStore.model),
  }
  const res = await update_api(params)
  if (res.status === 200) {
    onlyMessage('保存成功')
    visible.value = false
    routerNext()
  }
}

const cancel = () => {
  deployLoading.value = false
}
const onCancel = () => {
  visible.value = false
  routerNext()
}

onMounted(() => {
  getFlowDetail()
})

// 数据是否更改
const isChange = computed(
  () => JSON.stringify(oldData.value) !== JSON.stringify(flowStore.model),
)
onBeforeRouteLeave((to, form, next) => {
  if (!isModal.value && isChange.value && LocalStore.get(TOKEN_KEY)) {
    visible.value = true
    routerNext = next
  } else {
    next()
  }
})
onBeforeRouteUpdate((to, from, next) => {
  if (!isModal.value && isChange.value && LocalStore.get(TOKEN_KEY)) {
    visible.value = true
    routerNext = next
  } else {
    next()
  }
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

.validate-box {
  width: 0;
  height: 0;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  right: 0;
}

.model-content {
  text-align: center;
  margin: 20px 0;
}
</style>
