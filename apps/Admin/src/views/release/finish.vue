<template>
  <div class="finish">
    <div class="finish-content">
      <div class="label">
        正在发布
      </div>
      <div class="finish-body">
        <div class="progress-warp">
          <div class="progress-inner">
            <div :class="{'progress-bg': true, 'error': status === 'error', success: status === 'success'}" :style="{ width: width + '%' }"></div>
          </div>
        </div>
        <div style="width:60px; ">{{ width }}%</div>
      </div>
    </div>
    <div class="finish-status" v-if="loading">
      <h3 class="status">
        {{ status === 'success' ? '发布成功!' : '发布失败!'}}
      </h3>
      <template v-if="status === 'error'">
        <div class="error-msg" >
          {{ errorMsg }}
        </div>
        <j-button type="link" @click="restart" danger>
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

const emit = defineEmits(['update:value', 'statusChange'])

const width = ref(0)
const status = ref('')
const loading = ref(true)
const errorMsg = ref('')
const route = useRoute()
let count = 0

const { pause, resume } = useIntervalFn(() => {
  /* your function */
  if (width.value < count) {
    width.value += 0.5
  }
}, 100)

// const validateDraftFn = (id) => {
//   count = 33.333
//   validateDraft(id).then(resp => {
//     width.value = 33.33
//     releaseDraftFn(id)
//   }).catch((e) => {
//     width.value = 33.33
//     status.value = 'error'
//     loading.value = true
//     errorMsg.value = e?.response?.data?.message
//     console.log(e)
//     pause()
//   })
// }

const releaseDraftFn = (id) => {
  count = 50
  releaseDraft(id).then(resp => {
    width.value = 50
    saveMenuFn()
  }).catch((e) => {
    width.value = 50
    status.value = 'error'
    loading.value = true
    errorMsg.value = e?.response?.data?.message
    console.log(e)
    pause()
  })
}
const saveMenuFn = (id) => {
  count = 90
  saveMenu(props.tree).then(resp => {
    width.value = 100
    count = 100
    loading.value = true
    status.value = 'success'
    pause()
  }).catch((e) => {
    width.value = 90
    status.value = 'error'
    loading.value = true
    errorMsg.value = e?.response?.data?.message
    pause()
  })
}



const releaseStart = async () => {
  const { id } = route.params

  if (id) {
    status.value = 'loading'
    releaseDraftFn(id)
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
  status.value = ''
  errorMsg.value = ''
  loading.value = false
  resume()
}

watch(() => width.value, () => {
  emit('update:value', count)
})

watch(() => status.value, () => {
  emit('statusChange', status.value)
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 10%;

  .finish-content {
    .label {
      padding-bottom: 8px;
    }

    .finish-body {
      display: flex;
      gap: 24px;
    }
  }

  .finish-status {
    display: flex;
    flex-direction: column;
    align-items: center;

      > h3 {
        margin: 24px;
      }

      .error-msg {
        text-align: center;
      }
  }
}

.progress-warp {
  height: 20px;
  width: 520px;
  overflow: hidden;
  border-radius: 10px;


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
    background-color: #F74F46;
  }

  .success {
    background-color: #24B276;
  }
}
</style>
