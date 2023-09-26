<template>
  <div class="release-status">
    <div class="status-tree">
      <div class="status-result">
        总共  <span class="processing">{{ Object.keys(status).length }}</span> 条
        <span v-if="check.type === 'loading'">
         ，已校验
          <span class="processing">{{ check.fail + check.success }}</span> 条，未校验
          <span class="processing">{{ Object.keys(status).length - (check.fail + check.success)  }}</span> 条
        </span>
        <span v-if="check.type === 'end'">
         ，已校验
          <span class="processing">{{ check.fail + check.success }}</span> 条，正常
          <span class="success">{{ check.success }}</span> 条，失败
          <span class="error">{{ check.fail }}</span> 条
        </span>
      </div>
      <div class="status-source">
        <j-scrollbar>
          <j-tree
            v-model:expandedKeys="expandedKeys"
            :treeData="treeData"
            :fieldNames="{
              key: 'id'
            }"
          >
            <template #title="node">
              <div class="release-status-tree tree--node">
                <span>{{ node.title }}</span>
                <div v-if="status[node.id] === 0">
                  <span style="color: #315EFB">
                    <AIcon type="LoadingOutlined" />
                    正在校验
                  </span>
                </div>
                <div v-else-if="status[node.id] === 1" @click="() => showModal(node.id)">
                  <AIcon style="color: #FF3333" type="CloseCircleFilled"/>
                  <span style="color: #FF3333;padding-left: 4px;">
                    {{ statusMsg[node.id][0] }}
                    <span v-if="statusMsg[node.id].length > 1">
                      等{{ statusMsg[node.id].length }}个问题
                    </span>
                  </span>
                </div>
                <div v-else-if="status[node.id] === 2">
                  <AIcon style="color: #78E845" type="CheckCircleFilled"/>
                </div>
              </div>
            </template>
          </j-tree>
        </j-scrollbar>
      </div>
    </div>
    <div class="status-theme">
      <TitleComponent data="主题色配置"></TitleComponent>
      <div style="margin-bottom: 4px">
        主题色
      </div>
      <div class="theme-select">
        <div class="color" :style="{ backgroundColor: theme }">

        </div>
        <div style="flex: 1;">
          <a-select
            v-model:value="theme"
            option-label-prop="label"
            :options="options"
            style="width: 100%"
            @change="themeChange"
          >
            <template #option="{ value, label }">
              <div style="display: flex;gap: 24px;" >
                <div :style="{ width: '24px', height: '24px', backgroundColor: value}"></div>
                {{ label }}
              </div>
            </template>
          </a-select>
        </div>
      </div>
    </div>
    <div class="update-modal" v-show="visible">
      <div class="update-modal-header">
        <span>
          快速修改
          <span style="padding: 24px;color: #777;font-size: 14px; font-weight: 400;">修改完成后，请点击校验</span>
        </span>
        <div class="update-modal-header-close" @click="cancel">
          <AIcon type="CloseOutlined" />
        </div>
      </div>
      <div class="update-modal-body">
        <FormDesigner v-if="modelData.type === providerEnum.FormPage" :key="modelData.data.id" :data="modelData.data" ref="modelRef"/>
        <CustomHTML v-else-if="modelData.type === providerEnum.HtmlPage" :key="modelData.data.id" :data="modelData.data" ref="modelRef" />
        <CRUD v-else-if="modelData.type === providerEnum.CRUD" v-bind="modelData.data" :key="modelData.data.id" ref="modelRef" />
        <ListPage v-else-if="modelData.type === providerEnum.ListPage" :data="modelData.data" :key="modelData.data.id" ref="modelRef"/>
        <SQLCode v-else-if="modelData.type === providerEnum.SQL"  v-bind="modelData.data" :key="modelData.data.id" ref="modelRef"/>
        <FunctionCode v-else-if="modelData.type === providerEnum.Function"  v-bind="modelData.data" :key="modelData.data.id" ref="modelRef"/>
      </div>
    </div>
    <div class="release-validate-box">
      <FormDesigner v-if="validateContent.type === providerEnum.FormPage" :key="validateContent.key" :data="validateContent.data" ref="validateRef"/>
      <CustomHTML v-else-if="validateContent.type === providerEnum.HtmlPage" :key="validateContent.key" :data="validateContent.data" ref="validateRef" :showTip="false"/>
      <CRUD v-else-if="validateContent.type === providerEnum.CRUD" :key="validateContent.key" v-bind="validateContent.data" ref="validateRef" :showTip="false"/>
      <ListPage v-else-if="validateContent.type === providerEnum.ListPage" :key="validateContent.key" :data="validateContent.data" ref="validateRef" :showTip="false"/>
    </div>
  </div>
</template>

<script setup name="ReleaseStatus">
import { useEngine, useProduct } from '@/store'
import { providerEnum } from '@/components/ProJect/index'
import { validateDraft } from "@/api/project";
import { regular } from '@jetlinks/utils'

const props = defineProps({
  status: {
    type: Number,
  },
  theme: {
    type: String,
    default: '#1677ff'
  }
})

const emit = defineEmits(['update:status'])

const engine = useEngine()
const product = useProduct()
const expandedKeys = ref([])

const treeData = computed(() => {
  return product.data
})

const options = [
  { label: '薄暮', value: '#f5222d' },
  { label: '火山', value: '#fa541c' },
  { label: '日暮', value: '#fa8c16' },
  { label: '金秋', value: '#faad14' },
  { label: '日出', value: '#fadb14' },
  { label: '青柠', value: '#a0d911' },
  { label: '极光', value: '#52c41a' },
  { label: '碧穹', value: '#13c2c2' },
  { label: '夕雾', value: '#1677ff' },
  { label: '丁香', value: '#722ed1' },
  { label: '海棠', value: '#eb2f96' },
]

const theme = ref(props.theme)

const check = reactive({
  success: 0,
  fail: 0,
  progress: 0,
  wait: 0,
  type: 'loading'
})

const status = reactive({})
const statusMsg = reactive({})
const respStatus = reactive({
  status: {},
  msg: {}
})
const visible = ref(false)
const route = useRoute()

const validateRef = ref()
const modelRef = ref()

const modelData = reactive({
  type: undefined,
  data: {},
})

const validateContent = reactive({
  type: undefined,
  data: {},
  key: '',
  step: 0
})

const nextCheck = async () => {
  const _id = Object.keys(status)[validateContent.step]
  if (validateContent.step >= Object.keys(status).length) {
    emit('update:status', Object.values(statusMsg).filter(a => a.length).length)
    check.type = 'end'
  } else {
    check.type = 'loading'
    emit('update:status', true)
  }

  if (!_id) return

  await validateAll(_id, () => {
    validateContent.step += 1
    nextCheck()
  })
}

const validateDraftFn = async () => {
  respStatus.status = {}
  respStatus.msg = {}
  return new Promise((resolve) => {
    validateDraft(route.params.id).then(resp => {
      if (resp.success && resp.result) {
        for (let i =0;i< resp.result.length; i++) {
          const item = resp.result[i]
          if (!item.passed) {
            respStatus.status[item.id] = 1
            respStatus.msg[item.id] = item.messages
          }
        }
      } else {
        respStatus.status = {}
        respStatus.msg = {}
      }
      resolve()
    }).catch(() => { resolve() })
  })

}

/**
 * 开始校验
 */
const startCheck = async () => {
  validateContent.step = 0
  const maps = product.getDataMap()
  expandedKeys.value = [...maps.values()].map(item => item.id);
  [...maps.values()].filter(item => ![providerEnum.Module, 'project'].includes(item.type) ).map(item => { status[item.id] = 0})
  await validateDraftFn()
  await nextCheck()
}

const handleStatusItem = (id, s, error) => {
  const resp = respStatus.status[id] // 是否有后端校验异常
  if (resp) {
    console.log(respStatus.msg, id)
    status[id] = 1
    // 处理 error.message
    statusMsg[id] = error.concat(respStatus.msg[id])
  } else {
    status[id] = s
    statusMsg[id] = error
  }
}

const validateAll = async (id, cb) => {
  const item = product.getById(id)

  if (providerEnum.SQL === item.type) {
    const hasSql = !item.configuration.sql
    if (!hasSql) {
      handleStatusItem(item.id, hasSql ? 1 : 2, hasSql ? ['请输入sql'] : [] )
    } else {
      const _sql = !regular.isSql(item.configuration.sql)
      handleStatusItem(item.id, _sql ? 1 : 2, _sql ? ['请输入正确的sql'] : [] )
    }
    cb?.()
    return
  }

  if (providerEnum.HtmlPage === item.type && !item.configuration.code) {
    const hasCode = !item.configuration.code
    handleStatusItem(item.id, hasCode ? 1 : 2, hasCode ? ['页面代码为空'] : [] )
    cb?.()
    return
  }

  if (providerEnum.Function === item.type) {
    const hasScript = !item.configuration.script
    handleStatusItem(item.id, hasScript ? 1 : 2, hasScript ? ['请输入函数'] : [] )
    cb?.()
    return
  }

  if (item) {
    validateContent.type = item.type
    validateContent.data = item
    validateContent.key = item.id + '_' + new Date().getTime()
    nextTick(async () => {
      setTimeout(() => {
        validateRef.value.validate().then(ref => {
          status[item.id] = 2
          handleStatusItem(item.id, 2, [] )
          if (cb) {
            cb()
          } else {
            emit('update:status', Object.values(statusMsg).filter(item => item.length).length)
          }

        }).catch(e => {
          console.log('validateRef', e, e.map(a => a.message))
          handleStatusItem(item.id, 1, e.map(a => a.message) )
          if (cb) {
            cb()
          } else {
            emit('update:status', Object.values(statusMsg).filter(item => item.length).length)
          }
        })
      }, 1000)
    })
  }
}

const themeChange = (e) =>{
  const item = product.getById(product.info.id)

  item.others = {
    ...(item.others || {}),
    theme: e
  }

  product.update(item)
}

const cancel = async () => {
  visible.value = false
  status[modelData.id] = 0
  await validateDraftFn() // 重新查询错误信息
  await validateAll(modelData.id)
}

const showModal = (id) => {
  const item = product.getById(id)
  modelData.type = item.type
  modelData.data = item
  modelData.id = id
  visible.value = true
  setTimeout(() => {
    modelRef.value?.validate?.()
  }, 1000)
}

onMounted(() => {
  startCheck()
})

onBeforeMount(() => {
  const item = product.getById(product.info.id)
  if (item?.others?.theme) {
    theme.value = item.others.theme
  }
})

watch( () => JSON.stringify(status), () => {
  check.progress = 0
  check.fail = 0
  check.success = 0
  Object.values(status).forEach(a => {
    if(a === 0) {
      check.progress += 1
    }
    if (a === 1) {
      check.fail += 1
    }
    if (a === 2) {
      check.success += 1
    }
  })
})

</script>

<style scoped lang="less">
.release-validate-box {
  overflow: hidden;
  height: 0;
  width: 0;
}

.release-status {
  display: flex;
  height: 100%;
  gap: 24px;

  .status-tree {
    height: 100%;
    flex: 1 1 auto;

    .status-result {
      height: 40px;
      margin-bottom: 12px;

      .processing {
        color: #315EFB;
      }

      .success {
        color: #78E845;
      }

      .error {
        color: #FF3333;
      }
    }

    .status-source {
      height: calc(100% - 40px);

      :deep(.ant-tree-title) {
        .release-status-tree {
          &.tree--node {
            display: flex;
            gap: 12px;
          }
        }
      }

      .source-item {
        padding: 8px 0;
      }
    }
  }

  .status-theme {
    width: 30%;
    min-width: 300px;
    padding-left: 24px;
    border-left: 1px solid #e9e9e9;

    .theme-select {
      display: flex;
      gap: 8px;
      align-items: center;
      .color {
        width: 30px;
        height: 30px;
      }
    }
  }
}

.update-modal {
  background-color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 99;

  .update-modal-header {
    padding: 12px 16px;
    border-bottom: 1px solid #e3e3e3;
    display: flex;
    align-items: center;
    justify-content: space-between;

    >span {
      font-weight: 600;
      font-size: 16px;
    }

    .update-modal-header-close {
      font-size: 18px;
    }
  }

  .update-modal-body {
    padding: 12px 16px;
    overflow-y: auto;
    height: calc(100% - 54px);
  }
}

</style>
