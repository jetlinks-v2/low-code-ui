<template>
  <div class="finish">
    <div class="finish-content">
      <div class="label">
        正在发布
      </div>
      <div class="progress-warp">
        <div class="progress-inner">
          <div :class="{'progress-bg': true, 'error': status === 'error'}" :style="{ width: width + '%' }"></div>
        </div>
      </div>
      <div>{{ width }}%</div>
    </div>
    <div v-if="loading">
      {{ status === 'success' ? '发布成功' : '发布失败'}}
      <template v-if="status === 'error'">
        <span >
          {{ errorMsg }}
        </span>
        <j-button type="link" @click="restart">
          <template #icon><AIcon type="RedoOutlined" /></template>
           重试
        </j-button>
      </template>
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

const emit = defineEmits(['update:value'])

const width = ref(0)
const status = ref('success')
const loading = ref(false)
const errorMsg = ref('')
const route = useRoute()
let count = 0

const { pause, resume } = useIntervalFn(() => {
  /* your function */
  if (width.value < count) {
    width.value += 0.5
  }
}, 100)

const validateDraftFn = (id) => {
  count = 33.333
  validateDraft(id).then(resp => {
    width.value = 33.33
    releaseDraftFn(id)
  }).catch((e) => {
    width.value = 33.33
    status.value = 'error'
    loading.value = true
    errorMsg.value = e?.response?.data?.message
    console.log(e)
    pause()
  })
}

const releaseDraftFn = (id) => {
  count = 66.66
  releaseDraft(id).then(resp => {
    width.value = 66.66
    saveMenuFn()
  }).catch((e) => {
    width.value = 66.66
    status.value = 'error'
    loading.value = true
    errorMsg.value = e?.response?.data?.message
    console.log(e)
    pause()
  })
}
const saveMenuFn = (id) => {
  count = 99.99
  saveMenu(id).then(resp => {
    width.value = 100
    count = 100
    loading.value = true
    pause()
  }).catch((e) => {
    width.value = 99.99
    status.value = 'error'
    loading.value = true
    errorMsg.value = e?.response?.data?.message
    pause()
  })
}



const releaseStart = async () => {
  const { id } = route.params

  if (id) {
    validateDraftFn(id)
  }
}

const restart = () => {
  reset()
  setTimeout(() => {
    releaseStart()
  }, 1000)
}

const reset = () => {
  count = 0
  width.value = 0
  status.value = 'success'
  errorMsg.value = ''
  loading.value = false
  resume()
}

watch(() => width.value, () => {
  emit('update:value', count)
})

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

  .error {
    background-color: #ff4d4f;
  }
}
</style>
