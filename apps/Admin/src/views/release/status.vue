<template>
  <div class="release-status">
    <div class="status-tree">
      <div class="status-result">
        总共 {{ Object.keys(status).length }} 条
        <span v-if="check.type === 'loading'">
         ，已校验 {{ check.fail + check.success }} 条，未校验 {{ Object.keys(status).length - (check.fail + check.success)  }} 条
        </span>
        <span v-if="check.type === 'end'">
         ，已校验 {{ check.fail + check.success }} 条，正常 {{ check.success }} 条，失败 {{ check.fail }} 条
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
                  <AIcon type="LoadingOutlined" />
                  正在校验...
                </div>
                <div v-else-if="status[node.id] === 1" @click="() => showModal(node.id)">
                  <j-badge color="#f50" :text="statusMsg[node.id]" />
                </div>
                <div v-else-if="status[node.id] === 2">
                  <j-badge color="#87d068" text="通过" />
                </div>
              </div>
            </template>
          </j-tree>
        </j-scrollbar>
      </div>
    </div>
    <div class="status-theme">
      <div>
        主题色
      </div>
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
    <div class="release-validate-box">
      <FormDesigner v-if="validateContent.type === providerEnum.FormPage" :key="validateContent.data.id" :data="validateContent.data" ref="validateRef"/>
      <CustomHTML v-else-if="validateContent.type === providerEnum.HtmlPage" :key="validateContent.data.id" :data="validateContent.data" ref="validateRef"/>
      <CRUD v-else-if="validateContent.type === providerEnum.CRUD" :key="validateContent.data.id" v-bind="validateContent.data" ref="validateRef"/>
      <ListPage v-else-if="validateContent.type === providerEnum.ListPage" :key="validateContent.data.id" :data="validateContent.data" ref="validateRef"/>
    </div>

    <div class="update-modal" v-show="visible">
      <div class="update-modal-header">
        <span>快速修改</span>
        <div class="update-modal-header-close" @click="cancel">
          <AIcon type="CloseOutlined" />
        </div>
      </div>
      <div class="update-modal-body">
        <FormDesigner v-if="modelData.type === providerEnum.FormPage" :key="modelData.data.id" :data="modelData.data" ref="modelRef"/>
        <CustomHTML v-else-if="modelData.type === providerEnum.HtmlPage" :key="modelData.data.id" :data="modelData.data" ref="modelRef"/>
        <CRUD v-else-if="modelData.type === providerEnum.CRUD" v-bind="modelData.data" :key="modelData.data.id" ref="modelRef"/>
        <ListPage v-else-if="modelData.type === providerEnum.ListPage" :data="modelData.data" :key="modelData.data.id" ref="modelRef"/>
        <SQLCode v-else-if="modelData.type === providerEnum.SQL"  v-bind="modelData.data" :key="modelData.data.id" ref="modelRef"/>
        <FunctionCode v-else-if="modelData.type === providerEnum.Function"  v-bind="modelData.data" :key="modelData.data.id" ref="modelRef"/>
      </div>
    </div>
  </div>
</template>

<script setup name="ReleaseStatus">
import { useEngine, useProduct } from '@/store'
import { providerEnum } from '@/components/ProJect/index'


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

const theme = ref('#1677ff')

const check = reactive({
  success: 0,
  fail: 0,
  progress: 0,
  wait: 0,
  type: 'loading'
})

const status = reactive({})
const statusMsg = reactive({})
const visible = ref(false)

const validateRef = ref()
const modelRef = ref()

const modelData = reactive({
  type: undefined,
  data: {},
})

const validateContent = reactive({
  type: undefined,
  data: {},
  step: 0
})

const nextCheck = async () => {
  const _id = Object.keys(status)[validateContent.step]

  if (validateContent.step > Object.keys(status).length) {
    emit('update:status', Object.keys(statusMsg).length)
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

/**
 * 开始校验
 */
const startCheck = () => {
  validateContent.step = 0
  const maps = product.getDataMap()
  expandedKeys.value = [...maps.values()].map(item => item.id);
  [...maps.values()].filter(item => ![providerEnum.Module, 'project'].includes(item.type) ).map(item => { status[item.id] = 0})
  nextCheck()
}

const validateAll = async (id, cb) => {
  const item = product.getById(id)

  if (providerEnum.SQL === item.type) {
    if (!item.configuration.sql) {
      statusMsg[item.id] = '请输入sql'
    }
    status[item.id] = !item.configuration.sql ? 1 : 2
    cb?.()
    return
  }

  if (providerEnum.HtmlPage === item.type) {
    if (!item.configuration.code) {
      statusMsg[item.id] = '页面代码为空'
    }
    status[item.id] = !item.configuration.code ? 1 : 2
    cb?.()
    return
  }

  if (providerEnum.Function === item.type) {
    if (!item.configuration.script) {
      statusMsg[item.id] = '请输入函数'
    }
    status[item.id] = !item.configuration.script ? 1 : 2
    cb?.()
    return
  }

  if (item) {
    validateContent.type = item.type
    validateContent.data = item
    nextTick(async () => {
      setTimeout(() => {
        validateRef.value.validate().then(ref => {
          status[item.id] = 2
          delete statusMsg[item.id]
          if (cb) {
            cb()
          } else {
            emit('update:status', Object.keys(statusMsg).length)
          }

        }).catch(e => {
          status[item.id] = 1
          statusMsg[item.id] = e.map(a => a.message).join(',')
          if (cb) {
            cb()
          } else {
            emit('update:status', Object.keys(statusMsg).length)
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

const cancel = () => {
  visible.value = false
  status[modelData.id] = 0
  validateAll(modelData.id)
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
.release-status {
  display: flex;
  height: 100%;
  gap: 24px;

  .release-validate-box {
    overflow: hidden;
    height: 0;
    width: 0;
  }

  .status-tree {
    height: 100%;
    flex: 1 1 auto;

    .status-result {
      height: 40px;
      margin-bottom: 12px;
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
    width: 300px;
  }
}

.update-modal {
  background-color: #fff;
  position: absolute;
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
