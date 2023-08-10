<template>
  <div class="engine">
    <Header />
    <div class="engine-warp">
      <Tree />
      <Content />
    </div>
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
    flex-grow: 1;
    min-height: 0;
  }
}
</style>
