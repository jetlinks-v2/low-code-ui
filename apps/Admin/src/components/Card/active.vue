<template>
  <div class="checked-icon">
    <div class="checked-icon-content">
      <AIcon type="CheckOutlined" />
    </div>
  </div>
</template>

<script>
export default {
  name: "active"
}
</script>

<style scoped lang="less">
@width: 44px;

.checked-icon {
  position: absolute;
  right: -(@width/2);
  bottom: -(@width/2);
  z-index: 2;
  width: @width;
  height: @width;
  color: #fff;
  background-color: var(--ant-primary-color-active);
  transform: rotate(-45deg);

  .checked-icon-content {
    position: relative;
    height: 100%;
    transform: rotate(45deg);

    > span {
      position: absolute;
      top: 6px;
      left: 6px;
      font-size: 12px;
    }
  }
}
</style>
