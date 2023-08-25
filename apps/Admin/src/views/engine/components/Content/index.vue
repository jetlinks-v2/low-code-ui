<template>
  <div class="engine-content-warp">
    <Tabs />
  </div>
</template>

<script setup name="EngineContent">
import Tabs from './tabs.vue'

</script>

<style scoped lang="less">
.engine-content-warp {
  //display: flex;
  //min-width: 0;
  //flex-grow: 1;
  //flex-direction: column;
  flex: 1 1 auto;
  overflow: hidden;
}
</style>
