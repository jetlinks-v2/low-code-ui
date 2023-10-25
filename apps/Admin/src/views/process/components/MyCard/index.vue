<template>
  <div class="my-card" @click="handleClick">
    <j-badge :count="getCount()">
      <div class="center">
        <div class="icon">
          <ProImage :src="getImage(`${data.icon}`)" :preview="false" />
        </div>
        <div class="name">{{ data.name }}</div>
      </div>
    </j-badge>
  </div>
</template>
<script setup lang="ts">
import { getImage } from '@jetlinks/utils'

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
})
const router = useRouter()

const handleClick = () => {
  router.push({
    path: props.data.path,
  })
}

const getCount = () => {
  return 0
}
</script>
<style scoped lang="less">
.my-card {
  width: 320px;
  height: 240px;
  padding: 30px 80px;
  border-radius: 6px;
  border: 2px solid #ffffff;
  background: linear-gradient(180deg, #ffffff -3%, #ffffff 18%, #e6eefc 99%);

  .center {
    width: 160px;
    height: 180px;

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 160px;
      height: 140px;
    }
    .name {
      text-align: center;
      font-size: 16px;
      font-weight: normal;
      line-height: 20px;
      color: #000000;
    }
  }
}
</style>
