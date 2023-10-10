<template>
  <div class="advanced">
    <div class="content">
      <CardBox>
        <j-form :model="myRelation" ref="relationRef">
          <div class="title">
            开启关系
            <j-tooltip title="开启关系后，平台被关联方和关联方同时增加一条数据">
              <AIcon type="QuestionCircleOutlined" style="margin-left: 12px;color: #333;"/>
            </j-tooltip>
          </div>
          <div>
            <j-switch v-model:checked="myRelation.enabled" @change="updateRelation"/>
            <div class="descriptions-warp" style="margin-top: 16px;width: 500px;"
                 v-if="myRelation.enabled">
              <div class="descriptions-item">
                <div class="descriptions-title">
                  关系标识
                </div>
                <div class="descriptions-content">
                  <j-form-item name="relationType"
                               :rules="[{ required: true, message: '请输入关系标识'}, { max: 64, message: '最多可输入64位字符'}]">
                    <j-input :options="columnOptions" placeholder="请输入关系标识"
                             v-model:value="myRelation.relationType" style="width: 100%"
                             @change="updateRelation"/>
                  </j-form-item>
                </div>
              </div>
              <div class="descriptions-item">
                <div class="descriptions-title">
                  关系名称
                </div>
                <div class="descriptions-content">
                  <j-form-item name="relationTypeName"
                               :rules="[{ required: true, message: '请输入关系名称'},{ max: 16, message: '最多可输入16位字符'}]">
                    <j-input v-model:value="myRelation.relationTypeName" placeholder="请为关系命名"
                             @change="updateRelation"/>
                  </j-form-item>
                </div>
              </div>
            </div>
          </div>
        </j-form>
      </CardBox>
      <CardBox>
        <div class="tree-content">
          <div class="tree-left">
            <div class="title">
              树形结构
            </div>
            <j-switch v-model:checked="myTree" @change="treeChange"/>
          </div>
          <div class="tree-right">
            <div class="tree-box">
              <div style="margin-bottom: 12px">
                开启树形结构后会自动增加字段:
              </div>
              <div class="descriptions-warp" style="width: 350px;">
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
                <j-badge color="blue" text="查询时返回树结构"/>
              </p>
              <p>
                <j-badge color="blue" text="删除的时候会联动删除下级界面"/>
              </p>
            </div>
          </div>
        </div>
      </CardBox>
      <CardBox>
        <j-form :model="myAsset" ref="assetRef">
          <div class="title">
            开启资产
          </div>
          <div>
            <div>
              <j-switch v-model:checked="myAsset.enabled" style="margin-bottom: 16px" @change="assetEnableChange"/>
            </div>
            <template v-if="myAsset.enabled">
              <div style="margin-bottom: 16px">
                <j-radio-group :value="myAsset.correlatesAssets ? 'true' : 'false'"
                               button-style="solid" @change="assetRadioChange">
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
                    <j-select style="width: 100%;" value="id" :options="columnOptions" disabled/>
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
                      <j-input v-model:value="myAsset.assetType" placeholder="请输入资产标识"
                               @change="assetChange"/>
                    </j-form-item>
                  </div>
                </div>
                <div class="descriptions-item">
                  <div class="descriptions-title" style="padding: 4px 8px;text-align: left">
                    资产名称
                  </div>
                  <div class="descriptions-content">
                    <j-form-item name="assetTypeName"
                                 :rules="[{ required: true, message: '请输入资产名称'},{ max: 16, message: '最多可输入16位字符'}]">
                      <j-input v-model:value="myAsset.assetTypeName" placeholder="请输入资产名称"
                               @change="assetChange"/>
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
                    <j-select style="width: 100%;" v-model:value="myAsset.assetIdColumn"
                              :options="columnOptions" @change="assetChange"/>
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
                      <j-select style="width: 100%;" v-model:value="myAsset.assetType"
                                :options="options" :fieldNames="{ label: 'name', value: 'id'}"
                                @change="assetChange"/>
                    </j-form-item>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </j-form>
      </CardBox>
    </div>
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
      <div class="api">
        <AIcon type="BarsOutlined"></AIcon>
      </div>
    </j-popover>
  </div>
</template>

<script setup name="CRUDAdvanced">
import {getAssetType} from '@/api/basis'
import {useRequest} from '@jetlinks/hooks'
import {regular} from '@jetlinks/utils'
import {CRUD_COLUMNS, formErrorFieldsToObj, proAll} from "@/components/Database/util";
import {queryEndCommands} from '@/api/form'
import {useProduct} from '@/store'
import {AdvancedApiColumns} from './util'

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

const emit = defineEmits(['update:tree', 'update:asset', 'update:relation', 'update'])

const CrudColumns = inject(CRUD_COLUMNS)
const route = useRoute()
const project = useProduct()
const relationRef = ref()
const assetRef = ref()

const {data: options} = useRequest(getAssetType)
const {data: apiDataSource, run: apiRun} = useRequest(queryEndCommands,
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
  return CrudColumns.value.map(item => ({label: item.dataIndex, value: item.dataIndex}))
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
  myAsset.assetIdColumn = 'id'

  assetChange(v)
}
const assetChange = (v) => {
  if (v.target) {
    myAsset.correlatesAssets = v.target.value === 'true'
  }

  emit('update:asset', myAsset)
  emit('update')
}

const assetEnableChange = (v) => {
  myAsset.enabled = v
  emit('update:asset', v ? myAsset : {})
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
      proAll([
        relationRef.value?.validate,
        assetRef.value?.validate
      ]).then(r => {
        resolve(r)
      }).catch(e => {
        const errorMsg = {}
        e.forEach(item => {
          if(item.errorFields) {
            Object.assign(errorMsg, formErrorFieldsToObj(item.errorFields))
          } else {
            Object.assign(errorMsg, item)
          }
        })
        reject(errorMsg)
      })
    })
  }
})

</script>

<style scoped lang="less">
.advanced {
  position: relative;

  .content {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .title {
      margin-bottom: 8px;
    }

    .tree-content {
      display: flex;

      .tree-left {
        width: 180px;
      }

      .tree-right {
        flex: 1 1 auto;
        display: flex;
        background-color: #fafafa;
        padding: 14px;
        gap: 48px;

        .tree-box {

        }
      }
    }

  }

  .api {
    position: fixed;
    width: 40px;
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
    top: 168px;
    right: 16px;
    background-color: #fff;
    cursor: pointer;
    text-align: center;
    font-size: 18px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .14);
    z-index: 200;

    &:hover {
      box-shadow: 0 0 16px rgba(0, 0, 0, .14);
    }
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
        background-color: #fafafa;
      }

      .descriptions-content {
        padding: 4px 8px;
        background-color: #fff;

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
