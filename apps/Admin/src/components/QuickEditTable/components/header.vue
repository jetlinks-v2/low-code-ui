<template>
  <div class="quick-table--header">
      <div class="header-container" :style="{ width: width + 'px', transform: `translateX(-${scrollLeft}px)` }">
        <div class="header-cell" v-for="item in columns" :id="item.dataIndex" :style="{ width: item.width + 'px' }">
          <span class="header-cell-box">
            {{ item.title }}
            <template v-if="item.tooltip">
              <j-tooltip :title="item.tooltip">
                <AIcon type="QuestionCircleOutlined" style="margin-left: 8px;color: #333;" />
              </j-tooltip>
            </template>
          </span>
        </div>
      </div>
  </div>
</template>

<script setup name="QuickTableHeader">
import {HeaderProps, SCROLL_LEFT} from '../data'

const props = defineProps({
  ...HeaderProps()
})

const scrollLeft = inject(SCROLL_LEFT, 0)

const width = computed(() => {
  return props.columns.reduce((prev,curr) => {
    console.log(prev, curr.width)
    return prev + curr.width
  }, 0)
})

</script>

<style scoped lang="less">
.quick-table--header {
  min-height: 56px;
  position: relative;
  overflow: hidden;

  .header-container {
    min-height: 56px;
    display: flex;

    .header-cell {
      display: inline-flex;
      padding: 16px 0;
      align-items: center;
      font-weight: 500;
      text-align: left;
      overflow: visible;
      transition: background-color .2s ease;
      background-color: rgb(248, 248, 248);
      border-bottom: 1px solid rgb(240,240,240);

      .header-cell-box {
        box-sizing: border-box;
        position: relative;
        outline: none;
        padding: 0 16px;
        display: flex;
        width: 1px;
        z-index: 1;
        flex: 1;
        align-items: center;

        &:before {
          position: absolute;
          top: 50%;
          right: 1px;
          width: 1px;
          height: 1.6em;
          pointer-events: none;
          background-color: rgba(0, 0, 0, 0.06);
          transform: translateY(-50%);
          transition: background-color .3s;
          content: "";
        }
      }
    }
  }
}
</style>
