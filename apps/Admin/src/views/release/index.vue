<template>
  <div class="release-warp">
    <div class="release-header">
      <j-button type="link">返回</j-button>
      <span>发布</span>
    </div>
    <div class="release-body">

      <div class="release-content">
        <div class="release-step">
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
        </div>
        <div class="release-step-content" v-if="loading">
          <Status v-show="step === 1" :theme="theme" />
          <Tree v-show="step === 2" :tree="tree" />

        </div>
      </div>
    </div>
    <div class="release-footer">
      <j-button>取消</j-button>
      <j-button v-if="step !== 1" @click="prev">上一步</j-button>
      <j-button v-if="step !== 3" @click="next">下一步</j-button>
      <j-button>完成</j-button>
    </div>
  </div>
</template>

<script setup name="Release">
import Status from './status.vue'
import Tree from './projectTree.vue'
import { useProduct } from "@/store";

const route = useRoute()
const product = useProduct()

const step = ref(1)

const loading = ref(false)
const theme = ref('')
const tree = ref([])

const prev = () => {
  step.value -= 1
}

const next = () => {
  step.value += 1
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
    padding:  12px 48px;
    background-color: @layout-header;
    height: 56px;
    align-items: center;
  }

  .release-body {
    padding: 24px;
    height: calc(100% - 112px);

    .release-content {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;

      .release-step {
        width: 75%;
        margin-left: 25%;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
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
