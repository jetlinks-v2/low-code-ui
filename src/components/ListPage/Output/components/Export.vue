<template>
  <!-- 导出 -->
  <j-modal
    :maskClosable="false"
    :visible="visible"
    title="导出"
    okText="确定"
    cancelText="取消"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div style="margin-top: 10px">
      <j-space>
        <span>文件格式：</span>
        <j-radio-group
          v-model:value="type"
          placeholder="请选择文件格式"
          button-style="solid"
        >
          <j-radio-button value="xlsx">xlsx</j-radio-button>
          <j-radio-button value="csv">csv</j-radio-button>
        </j-radio-group>
      </j-space>
    </div>
    <template #footer>
      <j-button key="back" @click="handleCancel">取消</j-button>
      <j-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</j-button>
    </template>
  </j-modal>
</template>

<script setup lang="ts">
import { _export } from '@/api/list'
import { downloadFileByUrl, onlyMessage } from '@jetlinks-web/utils'
import { PropType } from 'vue'
const emit = defineEmits(['close', 'save'])

const props = defineProps({
  data: {
    type: Array,
    default: [],
  },
  open: {
    type: Boolean,
    default: false,
  },
  popData: {
    type: Object as PropType<Record<string, any>>,
    default: () => {},
  },
  projectId: {
    type: String,
    default: '',
  },
  selectedRowKeys: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})

const loading = ref(false)
const type = ref<string>('xlsx')
const visible = ref(false)
const handleOk = () => {
  handleExport(type.value)
}

const handleExport = async (type: string) => {
  if(!props.selectedRowKeys.length) {
    onlyMessage('请选择导出项', 'error')
    return
  }
  loading.value = true;
  const params = {
    format: type,
    template: false,
    paging: false,
    sorts: [
      {
        name: 'createTime',
        order: 'desc',
      },
    ],
    terms: [
      {
        terms: [
          {
            column: 'id',
            termType: 'in',
            value: props.selectedRowKeys
          }
          // ...props.selectedRowKeys.map((item) => {
          //   return {
          //     value: item,
          //     column: 'id',
          //     termType: 'eq',
          //     type: 'or',
          //   }
          // }),
        ],
      },
    ],
  }
  _export(
    props.projectId,
    props.popData.functions,
    props.popData.command,
    params,
  )
  .then((res: any) => {
    if (res) {
      const blob = new Blob([res.data], { type })
      const url = URL.createObjectURL(blob)
      downloadFileByUrl(url, `文件`, type)
      emit('save')
    }
  })
  .finally(() => {
      loading.value = false;
  })
}
const handleCancel = () => {
  emit('close')
}
watch(
  () => props.open,
  (val) => {
    visible.value = val
    type.value = 'xlsx'
  },
  { immediate: true },
)

defineExpose({
  handleExport,
})
</script>

<style scoped lang="less">
.track {
  background: rgba(125, 125, 125, 0.3);
  border-radius: 0.5rem;
  max-width: 20rem;
  width: 100%;
}

.sled {
  background: var(--vp-c-brand);
  border-radius: 50%;
  height: 1rem;
  position: absolute;
  width: 1rem;
}

.number.track {
  height: 1rem;
  margin: 0.5rem 0;
  padding: 0 0.5rem;
}

.number.track .sled {
  transform: translateX(-50%);
}

.vector.track {
  padding: 0.5rem;
}

.vector.track .relative {
  padding-bottom: 30%;
}

.vector.track .sled {
  transform: translateX(-50%) translateY(-50%);
}
</style>
