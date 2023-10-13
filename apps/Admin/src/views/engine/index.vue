<template>
  <div class="engine">
    <Header />
    <DragContent>
      <div class="engine-warp">
        <Tree />
        <Content />
      </div>
    </DragContent>
  </div>
</template>

<script setup name="Engine">
import { Header, Tree, Content } from './components'


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
}
</style>
