<template>
  <div class="finish">
    <div class="finish-content">
      <div class="label">
        正在发布
      </div>
      <div class="progress-warp">
        <div class="progress-inner">
          <div class="progress-bg" :style="{ width: width }"></div>
        </div>
      </div>
    </div>
    <div>

    </div>
  </div>
</template>

<script setup name="Finish">

const width = ref('0%')

const releaseStart = () => {

}



</script>

<style scoped lang="less">
.finish {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12%;

  .finish-content {
    .label {

    }
  }
}

.progress-warp {
  height: 38px;
  width: 500px;
  overflow: hidden;
  border-radius: 4px;

  .progress-inner {
    height: 100%;
    background-color: #f5f5f5;
  }
  .progress-bg {
    height: 100%;
    width: 80%;
    transition: all .3s ease;
    background-color: #315efb;
  }
}
</style>
