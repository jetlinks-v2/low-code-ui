<template>
  <div>
    <j-form-item :validateFirst="true" label="组件布局" name="layout">
      <div class="layout-box">
        <div
          class="layout-item"
          @click="onClick(item.value)"
          :class="target.componentProps.layout === item.value && 'layout-value'"
          v-for="item in list"
          :key="item.value"
        >
          <img :src="item.img" />
        </div>
      </div>
    </j-form-item>
    <j-form-item :validateFirst="true" label="组件尺寸" name="size">
      <!-- <j-radio-group
        v-model:value="target.componentProps.size"
        button-style="solid"
        @change="onDataChange"
      >
        <j-radio-button value="small">小</j-radio-button>
        <j-radio-button value="default">中</j-radio-button>
        <j-radio-button value="large">大</j-radio-button>
      </j-radio-group> -->
      <CheckButton
        :options="[
          { label: '小', value: 'small' },
          { label: '中', value: 'default' },
          { label: '大', value: 'large' },
        ]"
        @change="onDataChange"
        v-model:value="target.componentProps.size"
      />
    </j-form-item>
  </div>
</template>

<script lang="ts" setup>
import { useTarget } from '../../../../hooks'
import { CheckButton } from '@LowCode/components/index'

const { target } = useTarget()

const emits = defineEmits(['refresh'])

const list = [
  {
    value: 'horizontal',
    img: '/images/form-designer/horizontal.png',
  },
  {
    value: 'vertical',
    img: '/images/form-designer/vertical.png',
  },
  {
    value: 'inline',
    img: '/images/form-designer/inline.png',
  },
]

const onDataChange = () => {
  emits('refresh', target.value)
}

const onClick = (key: string) => {
  target.value.componentProps.layout = key
  emits('refresh', target.value)
}
</script>

<style lang="less" scoped>
.layout-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  .layout-item {
    width: 96px;
    height: 56px;
    background-color: #f1f4fa;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #ebf1fc;
    }
  }

  .layout-value {
    background-color: #315efb !important;
  }
}
</style>