<template>
  <div class="engine-header">
    <div class="content">
      <j-button type="link" @click="quit">退出</j-button>
      <div> {{ product.info?.name }}</div>
    </div>
    <div class="release">
      <j-button type="primary" @click="onRelease">发布</j-button>
    </div>
  </div>
</template>

<script setup name="EngineHeader">
import { useProduct } from '@/store'

const product = useProduct()

const router = useRouter()
const route = useRoute()
const onRelease = () => {
  router.replace({
    name: 'Release',
    params: {
      id: route.params.id
    }
  })
}

const quit = () => {
  router.push('/delivery/center')
  product.initProjectState()
}
</script>

<style scoped lang="less">
.engine-header {
  display: flex;
  padding:  12px 48px;
  background-color: @layout-header;
  //border-bottom: 1px solid #515665;

  .content {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
  }

  .release {

  }
}
</style>
