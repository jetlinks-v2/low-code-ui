<template>
  <div class="my-card" @click="handleClick">

    <div class="center">
      <j-badge class="card-badge" :count="getCount"></j-badge>
      <div class="icon">
        <ProImage :src="getImage(`${data.icon}`)" :preview="false" />
      </div>
      <div class="name">{{ data.name }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getImage } from '@jetlinks-web/utils'
import { useMenuStore } from '@LowCode/store'
import { ProImage } from '@LowCode/components/index'

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
})
const router = useRouter()

const menu = useMenuStore()

const handleClick = () => {
  // router.push({
  //   path: props.data.path,
  // })
  menu.jumpPage(props.data.code)
}

const count = reactive({})

const getCount = computed(() => {
  if (props.data.key) {
    props.data.fun().then((res) => {
      count[props.data.key] = res.data
    })
    return count[props.data.key]
  }
    return 0
})
</script>
<style scoped lang="less">
.my-card {
  width: 320px;
  height: 240px;
  padding: 30px;
  border-radius: 6px;
  border: 2px solid #ffffff;
  background: linear-gradient(180deg, #ffffff -3%, #ffffff 18%, #e6eefc 99%);

  .center {
    width: 100%;
    height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;

    .card-badge {
      position: absolute;
      top: -14px;
      right: -14px;
    }

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
      margin-top: 16px;
    }
  }
}
</style>
