<template>
  <div class="advanced">
    <div class="content">
      <div class="card">
        <j-form :model="myRelation" ref="relationRef">
            <div class="title">
              开启关系
              <j-tooltip title="开启关系后，平台被关联方和关联方同时增加一条数据">
                <AIcon type="QuestionCircleOutlined" style="margin-left: 12px;color: #333;" />
              </j-tooltip>
            </div>
            <div>
              <j-switch v-model:checked="myRelation.enabled" @change="updateRelation" />
              <div class="descriptions-warp" style="margin-top: 24px;width: 500px;" v-if="myRelation.enabled">
                <div class="descriptions-item">
                  <div class="descriptions-title">
                    关系标识
                  </div>
                  <div class="descriptions-content">
                    <j-form-item name="relationType" :rules="[{ required: true, message: '请输入关系标识'}, { max: 64, message: '最多可输入64位字符'}]">
                      <j-input :options="columnOptions" placeholder="请输入关系标识" v-model:value="myRelation.relationType" style="width: 100%" @change="updateRelation" />
                    </j-form-item>
                  </div>
                </div>
                <div class="descriptions-item">
                  <div class="descriptions-title">
                    关系名称
                  </div>
                  <div class="descriptions-content">
                    <j-form-item name="relationTypeName" :rules="[{ required: true, message: '请输入关系名称'},{ max: 16, message: '最多可输入16位字符'}]">
                      <j-input v-model:value="myRelation.relationTypeName" placeholder="请为关系命名" @change="updateRelation" />
                    </j-form-item>
                  </div>
                </div>
              </div>
            </div>
        </j-form>
      </div>
      <div class="card">
            <div class="title">
              树形结构
            </div>
            <div style="display: flex; gap: 24px;">
              <j-switch v-model:checked="myTree" @change="treeChange" />
              <div style="width: 400px;">
                <div class="descriptions-warp">
                  <div class="descriptions-item">
                    <div class="descriptions-title" style="padding: 4px;text-align: left">
                      字段
                    </div>
                    <div class="descriptions-content">
                     parentId
                    </div>
                    <div class="descriptions-content">
                      path
                    </div>
                    <div class="descriptions-content">
                      sortIndex
                    </div>
                    <div class="descriptions-content">
                      level
                    </div>
                  </div>
                  <div class="descriptions-item">
                    <div class="descriptions-title" style="padding: 4px 8px;text-align: left">
                      说明
                    </div>
                    <div class="descriptions-content">
                      父节点ID
                    </div>
                    <div class="descriptions-content">
                      树路径
                    </div>
                    <div class="descriptions-content">
                      排序序号
                    </div>
                    <div class="descriptions-content">
                      树层级
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p>
                  自动增加功能:
                </p>
                <p>
                  查询时返回树结构
                </p>
                <p>
                  删除的时候会联动删除下级界面
                </p>
              </div>
            </div>
          </div>
      <div class="card">
        <j-form :model="myAsset" ref="assetRef">
          <div class="title">
            开启资产
          </div>
          <div >
            <div>
              <j-switch v-model:checked="myAsset.enabled" style="margin-bottom: 24px" />
            </div>
            <template v-if="myAsset.enabled">
              <div style="margin-bottom: 24px">
                <j-radio-group :value="myAsset.correlatesAssets ? 'true' : 'false'" button-style="solid" @change="assetRadioChange">
                  <j-radio-button value="false">设为资产</j-radio-button>
                  <j-radio-button value="true">间接资产</j-radio-button>
                </j-radio-group>
              </div>
              <div v-if="!myAsset.correlatesAssets" class="descriptions-warp" style="width: 600px;">
                <div class="descriptions-item">
                  <div class="descriptions-title" style="padding: 4px;text-align: left">
                    列名称
                  </div>
                  <div class="descriptions-content">
                      <j-select style="width: 100%;" value="id" :options="columnOptions" disabled />
                  </div>
                </div>
                <div class="descriptions-item">
                  <div class="descriptions-title" style="padding: 4px 8px;text-align: left">
                    资产标识
                  </div>
                  <div class="descriptions-content">
                    <j-form-item
                      name="assetType"
                      :validateFirst="true"
                      :rules="[
                        { pattern: regular.modalReg, message: '请输入字母+数字+下划线组成，并以字母开头'},
                        { required: true, message: '请输入资产标识'},
                        { max: 64, message: '最多可输入64位字符'}
                        ]">
                      <j-input v-model:value="myAsset.assetType" placeholder="请输入资产标识" @change="assetChange" />
                    </j-form-item>
                  </div>
                </div>
                <div class="descriptions-item">
                  <div class="descriptions-title" style="padding: 4px 8px;text-align: left">
                    资产名称
                  </div>
                  <div class="descriptions-content">
                    <j-form-item name="assetTypeName" :rules="[{ required: true, message: '请输入资产名称'},{ max: 16, message: '最多可输入16位字符'}]">
                      <j-input v-model:value="myAsset.assetTypeName" placeholder="请输入资产名称" @change="assetChange" />
                    </j-form-item>
                  </div>
                </div>
              </div>
              <div v-else class="descriptions-warp" style="width: 600px;">
                <div class="descriptions-item">
                  <div class="descriptions-title" style="padding: 4px;text-align: left">
                    当前表字段
                  </div>
                  <div class="descriptions-content">
                    <j-select style="width: 100%;" v-model:value="myAsset.assetIdColumn" :options="columnOptions" @change="assetChange" />
                  </div>
                </div>
                <div class="descriptions-item">
                  <div class="descriptions-title" style="padding: 4px 8px;text-align: left">
                    资产标识
                  </div>
                  <div class="descriptions-content">
                    <j-form-item
                      name="assetType"
                      :rules="[{ required: true, message: '请选择资产标识'}]">
                      <j-select style="width: 100%;" v-model:value="myAsset.assetType" :options="options" :fieldNames="{ label: 'name', value: 'id'}" @change="assetChange" />
                    </j-form-item>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </j-form>
      </div>
    </div>
    <div class="api">
        <j-popover placement="leftBottom" trigger="click" @visibleChange="getApi">
          <template #content>
            <div style="width: 750px">
              <j-table
                :columns="AdvancedApiColumns"
                :dataSource="apiDataSource"
                size="small"
                :pagination="false"
              >
                <template #bodyCell="{ column, text }">
                  <template v-if="column.dataIndex === 'api'">
                    <j-ellipsis>
                      {{ text }}
                    </j-ellipsis>
                  </template>
                  <template v-if="column.dataIndex === 'description'">
                    <j-ellipsis>
                      {{ text }}
                    </j-ellipsis>
                  </template>
                </template>
              </j-table>
            </div>
          </template>
          <j-button >查看接口能力</j-button>
        </j-popover>
    </div>
  </div>
</template>

<script setup name="CRUDAdvanced">
import { getAssetType } from '@/api/basis'
import { useRequest } from '@jetlinks/hooks'
import { regular } from '@jetlinks/utils'
import {CRUD_COLUMNS} from "@/components/Database/util";
import { queryEndCommands } from '@/api/form'
import { useProduct } from '@/store'
import { AdvancedApiColumns } from './util'

const props = defineProps({
  tree: {
    type: Boolean,
    default: false,
  },
  asset: {
    type: Object,
    default: () => ({})
  },
  relation: {
    type: Object,
    default: () => ({})
  },
  id: {
    type: String,
    default: undefined
  },
  parentId: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['update:tree','update:asset','update:relation', 'update'])

const CrudColumns = inject(CRUD_COLUMNS)
const route = useRoute()
const project = useProduct()
const relationRef = ref()
const assetRef = ref()

const { data:options } = useRequest(getAssetType)
const { data: apiDataSource, run: apiRun } = useRequest(queryEndCommands,
  {
    immediate: false,
    onSuccess(res) {
      const item = res.result.find(a => a.id === props.id)
      const arr = item?.command?.map(a => {
        return {
          ability: a.name,
          api: `/low-code/runtime/${project.info.id}/${props.parentId}/${a.id}`,
          instruction: a.id,
          description: a.description
        }
      })
      return arr || []
    }
  }
)

const columnOptions = computed(() => {
  return CrudColumns.value.map(item => ({ label: item.dataIndex, value: item.dataIndex }))
})

const myRelation = reactive(props.relation || {
  enabled: true,
  relationType: undefined,
  relationTypeName: undefined
})

const myAsset = reactive(props.asset || {
  enabled: false,
  assetIdColumn: 'id',
  assetType: undefined,
  assetTypeName: undefined,
  correlatesAssets: false
})


const updateRelation = () => { // 关系数据发生变化
  emit('update:relation', myRelation)
  emit('update')
}

const myTree = ref(props.tree || false)

const assetRadioChange = (v) => {
  myAsset.assetType = undefined
  myAsset.assetTypeName = undefined

  if (v.target.value === 'false') {
    myAsset.assetIdColumn = 'id'
  }

  assetChange(v)
}
const assetChange = (v) => {
  if (v.target) {
    myAsset.correlatesAssets = v.target.value === 'true'
  }

  emit('update:asset', myAsset)
  emit('update')
}

const treeChange = () => {
  emit('update:tree', myTree.value)
  emit('update')
}

const getApi = (v) => {
  if (v) {
    apiRun(route.params.id, [])
  }
}

defineExpose({
  validates: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const r = await relationRef.value?.validate()
        const a = await assetRef.value?.validate()
        resolve(r)
      } catch (e) {
        reject(e)
      }
    })
  }
})

</script>

<style scoped lang="less">
.advanced {
  padding: 0 24px;
  display: flex;
  gap: 24px;

  .content {
    flex: 1 1 auto;
    min-width: 0;

    .card {
      border: 1px solid #dfdfdf;
      padding: 16px;
      &:not(:last-child) {
        margin-bottom: 24px;
      }

      .title {
        margin-bottom: 12px;
      }
    }
  }

  .api {
    flex-basis: 112px;
  }


  .descriptions-warp {
    display: flex;
    border: 1px solid #f0f0f0;

    .descriptions-item {
      flex: 1;
      &:not(:last-child) {
        border-right: 1px solid #f0f0f0;
      }

      .descriptions-title {
        padding: 12px 12px;
        text-align: center;
        border-bottom: 1px solid #f0f0f0;
      }

      .descriptions-content {
        padding: 4px 8px;

        &:not(:last-child) {
          border-bottom: 1px solid #f0f0f0;
        }
      }

      .descriptions-title, & .descriptions-content {

      }
    }
  }
}
</style>
