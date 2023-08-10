<template>
  <div class="engine-header">
    <div class="content">

    </div>
    <div class="release">
      <span >发布</span>
    </div>
  </div>
</template>

<script setup name="EngineHeader">

</script>

<style scoped lang="less">
.engine-header {
  display: flex;
  padding:  12px 48px;
  background-color: @layout-header;
  //border-bottom: 1px solid #515665;

  .content {
    flex: 1 1 auto;
  }

  .release {

  }
}
</style>
