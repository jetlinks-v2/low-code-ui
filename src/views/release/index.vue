<template>
  <div class="release-warp">
    <div class="release-header">
      <!-- <j-button type="link" @click="cancel">返回</j-button> -->
      <j-button type="link" @click="cancel" class="btn" :disabled="['success', 'loading'].includes(releaseStatus)">
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
          </j-step>
          <j-step title="系统菜单">
          </j-step>
          <j-step title="完成">
          </j-step>
        </j-steps>
      </CardBox>

      <CardBox class="release-content"  v-if="loading">
        <div class="release-step-content">
          <Status v-show="step === 0" v-model:status="status" v-model:theme="themeColor" />
          <Tree v-show="step === 1" ref="treeRef" @change="treeChange" />
          <Finish v-show="step === 2" ref="finishRef"  v-model:value="finishStatus" :theme="themeColor" :tree="tree" @statusChange="e => releaseStatus = e" />
        </div>
        <div class="release-footer">
          <j-button v-if="step === 0" @click="cancel">取消</j-button>
          <j-button v-if="step === 0" type="primary" @click="next" :disabled="status">下一步</j-button>

          <j-button v-if="step === 1" @click="prev">上一步</j-button>
          <j-button v-if="step === 1" type="primary" @click="release">发布</j-button>

          <j-button v-if="step === 2" type="primary" @click="cancel" :disabled="!finishStatus">完成</j-button>
        </div>
      </CardBox>
    </div>

  </div>
</template>

<script setup name="Release">
import Status from './status.vue'
import Tree from './projectTree.vue'
import Finish from './finish.vue'
import { useProduct, useEngine } from "@LowCode/store";
import { getImage } from '@jetlinks-web/utils';
import { CardBox } from '@LowCode/components/index';

const route = useRoute()
const product = useProduct()
const engine = useEngine()

const step = ref(0)

const loading = ref(false)
const tree = ref([])
const treeRef = ref()

const finishRef = ref()

const router = useRouter()

const status = ref(true)
const finishStatus = ref(false)
const themeColor = ref('#1677ff')

const releaseStatus = ref('')

const prev = () => {
  step.value -= 1
}

const next = () => {
  step.value += 1
  if (step.value === 1) {
    treeRef.value.init()
  }
}

const treeChange = (data) => {
  tree.value = data
}

const cancel = () => {
  router.replace({
    name: 'engine',
    params: {
      id: route.params.id
    }
  })
}

const release = () => {
  step.value += 1
  console.log('release----releaseStart')
  finishRef.value?.releaseStart()
}

product.queryProduct(route.params.id, () => {
  console.log('product.info', product.info)
  themeColor.value = product.info.others?.theme
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

      &[disabled] {
        color: rgba(0, 0, 0, 0.25);
      }
    }
    span{
      font-size: 18px;
    }
  }

  .release-body {
    padding: 24px;
    height: calc(100% - 56px);
    background-color: rgb(246,246,246);

    .card {
      margin-bottom: 16px;
    }

    .release-content {
      height: calc(100% - 96px);
      position: relative;

      .release-step-content {
        height: calc(100% - 82px);
      }

      .release-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 24px;
        border-top: 1px solid #e9e9e9;
      }
    }


  }


}
</style>
