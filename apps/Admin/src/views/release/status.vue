<template>
  <div class="release-status">
    <div class="status-tree">
      <div class="status-result">
        总共 {{ Object.keys(status).length }} 条
        <span v-if="check.type === 'loading'">
         ，已校验 {{ check.progress }} 条，未校验 {{ check.wait }} 条
        </span>
        <span v-if="check.type === 'end'">
         ，已校验 {{ check.progress }} 条，正常 {{ check.success }} 条，失败 {{ check.fail }} 条
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
                <div v-else-if="status[node.id] === 1">
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
      {{validateContent.type}}
      <FormDesigner v-if="validateContent.type === providerEnum.FormPage" :data="validateContent.data" ref="validateRef"/>
      <CustomHTML v-else-if="validateContent.type === providerEnum.HtmlPage" :data="validateContent.data" ref="validateRef"/>
      <CRUD v-else-if="validateContent.type === providerEnum.CRUD" v-bind="validateContent.data" ref="validateRef"/>
      <ListPage v-else-if="validateContent.type === providerEnum.ListPage" :data="validateContent.data" ref="validateRef"/>
    </div>
    <j-modal

    >

    </j-modal>
  </div>
</template>

<script setup name="ReleaseStatus">
import { useEngine, useProduct } from '@/store'
import { providerEnum } from '@/components/ProJect/index'

const props = defineProps({
  theme: {
    type: String,
    default: '#1677ff'
  }
})

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

const theme = ref(props.theme || '#1677ff')

const check = reactive({
  success: 0,
  fail: 0,
  progress: 0,
  wait: 0,
  type: 'loading'
})

const status = reactive({})
const statusMsg = reactive({})

const validateRef = ref()

const validateContent = reactive({
  type: undefined,
  data: {},
  step: 0
})

const nextCheck = async () => {
  const _id = Object.keys(status)[validateContent.step]
  const item = product.getById(_id)

  if (!item) return

  if (providerEnum.SQL === item.type) {
    if (!item.configuration.code) {
      statusMsg[item.id] = '请输入sql'
    }
    status[item.id] = !item.configuration.script ? 1 : 2
    validateContent.step += 1
    await nextCheck()
    return
  }

  if (providerEnum.Function === item.type) {
    if (!item.configuration.script) {
      statusMsg[item.id] = '请输入函数'
    }
    status[item.id] = !item.configuration.script ? 1 : 2
    validateContent.step += 1
    await nextCheck()
    return
  }

  if (item) {
    validateContent.type = item.type
    validateContent.data = item
    console.log(item)
    await nextTick(async () => {
      validateRef.value.validate().then(ref => {
        status[item.id] = 2
      }).catch(e => {
        status[item.id] = 1
        console.log(e)
      }).finally(() => {
        validateContent.step += 1
        nextCheck()
      })
    })
  }
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

onMounted(() => {
  startCheck()
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
</style>
<style>

</style>
