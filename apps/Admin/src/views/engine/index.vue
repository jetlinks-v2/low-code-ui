<template>
  <div class="engine">
    <Header />
    <DragContent>
      <div class="engine-warp">
        <Tree />
        <Content />
      </div>
      <div class="path">
        <div style="margin-left: 10px;">{{ path }}</div>
      </div>
    </DragContent>
  </div>
</template>

<script setup name="Engine">
import { Header, Tree, Content } from './components'
import { useProduct, useEngine } from '@/store'
const engine = useEngine()
const product = useProduct()

const path = ref()

watchEffect(() => {
  if (engine.activeFile) {
    const data = product.getById(engine.activeFile)
    path.value = product.getParent(data).map((item) => item.title).join(' -> ')
    console.log('data-------', path.value)
  }

})

</script>

<style scoped lang="less">
.engine {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;

  .engine-warp {
    display: flex;
    height: calc(100% - 56px);
  }
  .path{
    background-color: rgb(216, 216, 216);
    z-index: 999;
    height: 30px;
    line-height: 30px;
  }
}
</style>
