<template>
  <div class="finish">
    <div class="finish-content">
      <div class="label">
        正在发布
      </div>
      <div class="progress-warp">
        <div class="progress-inner">
          <div class="progress-bg" :style="{ width: width + '%' }"></div>
        </div>
      </div>
    </div>
    <div>

    </div>
  </div>
</template>

<script setup name="Finish">
import { releaseDraft, validateDraft } from '@/api/project'
import { saveMenu } from '@/api/menu'
import { useIntervalFn } from '@vueuse/core'

const props = defineProps({
  tree: {
    type: Array,
    default: () => []
  }
})

const width = ref(0)
const status = ref('success')
const route = useRoute()
let count = 0

const { pause, resume } = useIntervalFn(() => {
  /* your function */
  if (width.value < count) {
    width.value += 10
  }
}, 300)

const releaseStart = async () => {
  const { id } = route.params

  if (id) {
    //  发布校验
    count = 33.333
    const validateResp = await validateDraft(id)
    if (!validateResp.success) {
      status.value = 'error'
      pause()
      return
    }
    width.value = 33.33
    //  发布接口
    count = 66.66
    const releaseResp = await releaseDraft(id)
    if (!releaseResp.success) {
      status.value = 'error'
      pause()
      return
    }
    width.value = 66.66
    count = 99
    // 修改菜单
    const menuResp = await saveMenu(props.tree)

    if (!menuResp.success) {
      width.value = 99
      status.value = 'error'
      pause()
      return
    }
    width.value = 100
    count = 100
    pause()
  }
}

const reset = () => {
  count = 0
  width.value = 0
  resume()
}

onBeforeMount(() => {
  reset()
})

defineExpose({
  releaseStart
})

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
