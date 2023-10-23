<template>
  <div class="engine-header">
    <div class="content">

      <j-button type="link" @click="quit" class="btn">
        <div class="out"><img :src="getImage('/left.png')"></div>
        <p>退出</p>
      </j-button>
      <div class="title">
        <div style="margin-right: 10px;">
          <img :src="getImage('/tree/project.svg')">
        </div>
        {{ product.info?.name }}
      </div>
    </div>
    <div class="release">
      <j-button type="primary" @click="onRelease">发布</j-button>
    </div>
  </div>
</template>

<script setup name="EngineHeader">
import { useProduct, useEngine } from '@/store'
import { getImage } from '@jetlinks/utils';

const product = useProduct()
const engine = useEngine()

const router = useRouter()
const route = useRoute()
const onRelease = () => {
  router.replace({
    name: 'release',
    params: {
      id: route.params.id
    }
  })
}

const quit = async () => {
  router.push('/delivery/center')
}

onMounted(() => {
  setTimeout(() => {
    const data = product.data[0]
    // console.log('data',data)
    if (data?.state?.value !== 'published') {
      engine.selectFiles(data?.others?.files || [])
      engine.setActiveFile(data?.others?.activeFile || data?.id)
      engine.selectFile(data?.others?.activeFile)
    } else {
      engine.setActiveFile(data?.id)
      engine.selectFile(data.id)
    }
  }, 300)
})

</script>

<style scoped lang="less">
.engine-header {
  display: flex;
  padding: 12px 12px;
  background-color: @layout-header;
  // border-bottom: 1px solid #515665;
  box-sizing: border-box;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  border-color: #D9D9D9;

  .content {
    flex: 1 1 auto;
    display: flex;
    align-items: center;

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

      p {
        line-height: 22px;
        font-size: 16px;
        margin-left: 10px;
      }
    }

    .title {
      font-size: 18px;
      line-height: 22px;
      display: flex;
    }
  }

  .release {}
}
</style>
