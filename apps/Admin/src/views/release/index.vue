<template>
  <div class="release-warp">
    <div class="release-header">
      <!-- <j-button type="link" @click="cancel">返回</j-button> -->
      <j-button type="link" @click="cancel" class="btn">
        <div class="out"><img :src="getImage('/left.png')"></div>
        <p>退出</p>
      </j-button>
      <span>发布</span>
      <!-- <j-button type="primary">发布</j-button> -->
    </div>
    <div class="release-body">
      <CardBox class="card ">
        <j-steps :current="step">
          <j-step title="状态确认">
            <template #icon>
            </template>
          </j-step>
          <j-step title="系统菜单">
            <template #icon>
            </template>
          </j-step>
          <j-step title="完成">
            <template #icon>
            </template>
          </j-step>
        </j-steps>
      </CardBox>

      <CardBox>
        <div class="release-step-content" v-if="loading">
          <Status v-show="step === 1" v-model:status="status" />
          <Tree v-show="step === 2" ref="treeRef" @change="treeChange" />
          <Finish ref="finishRef" v-show="step === 3" v-model:value="finishStatus" :tree="tree" />
        </div>
      </CardBox>
    </div>
    <div class="release-footer">
      <j-button v-if="step === 1" @click="cancel">取消</j-button>
      <j-button v-if="step === 1" type="primary" @click="next" :disabled="status">下一步</j-button>

      <j-button v-if="step === 2" @click="prev">上一步</j-button>
      <j-button v-if="step === 2" type="primary" @click="release">发布</j-button>

      <j-button v-if="step === 3" type="primary" @click="cancel" :disabled="finishStatus !== 100">完成</j-button>
    </div>
  </div>
</template>

<script setup name="Release">
import Status from './status.vue'
import Tree from './projectTree.vue'
import Finish from './finish.vue'
import { useProduct, useEngine } from "@/store";
import { getImage } from '@jetlinks/utils';

const route = useRoute()
const product = useProduct()
const engine = useEngine()

const step = ref(1)

const loading = ref(false)
const tree = ref([])
const treeRef = ref()

const finishRef = ref()

const router = useRouter()

const status = ref(true)
const finishStatus = ref(0)

const prev = () => {
  step.value -= 1
}

const next = () => {
  step.value += 1
  if (step.value === 2) {
    treeRef.value.init()
  }
}

const treeChange = (data) => {
  tree.value = data
}

const cancel = () => {
  // 清空engine中的状态
  engine.initEngineState()

  router.replace({
    name: 'Engine',
    params: {
      id: route.params.id
    }
  })
}

const release = () => {
  step.value += 1
  finishRef.value?.releaseStart()
}

product.queryProduct(route.params.id, () => {
  loading.value = true
})

</script>

<style scoped lang="less">
.release-warp {
  height: 100vh;

  .release-header {
    display: flex;
    padding:  12px 24px;
    background-color: @layout-header;
    height: 56px;
    align-items: center;
    box-sizing: border-box;
    border-width: 0px 0px 1px 0px;
    border-style: solid;
    border-color: #D9D9D9;
    .btn {
      display: flex;
      color: #333333;
      .out {
        width: 18px;
        height: 15px;

        img {
          width: 100%;
          height: 100%;
        }
      }
      p{
        line-height: 22px;
        font-size: 16px;
        margin-left: 10px;
      }
    }
    span{
      font-size: 18px;
    }
  }

  .release-body {
    padding: 24px;
    height: calc(100% - 112px);
    background-color: rgb(246,246,246);

    .card {
      margin-bottom: 16px;
    }

    .release-content {
      width: 100%;
      height: 100%;

      .release-step {
        padding: 44px;
        margin-bottom: 16px;
        border-radius: 8px;
        background-color: #fff;
      }

      .release-step-content {
        height: calc(100% - 56px);
      }
    }
  }

  .release-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 12px 24px;
  }
}
</style>
