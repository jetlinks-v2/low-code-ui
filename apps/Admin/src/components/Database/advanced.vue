<template>
  <div class="advanced">
    <div class="content">
      <div class="card">
        <div class="title">
          开启关系
          <j-tooltip title="开启关系后，平台被关联方和关联方同时增加一条数据">
            <AIcon type="QuestionCircleOutlined" style="margin-left: 12px;color: #333;" />
          </j-tooltip>
        </div>
        <div>
          <j-switch v-model:checked="myRelation.enabled" />
          <div class="descriptions-warp" style="margin-top: 24px;width: 500px;">
            <div class="descriptions-item">
              <div class="descriptions-title">
                关系标识
              </div>
              <div class="descriptions-content">
                <j-select :options="columnOptions" v-model:value="myRelation.relationType" style="width: 100%" @change="relationChange" />
              </div>
            </div>
            <div class="descriptions-item">
              <div class="descriptions-title">
                关系名称
              </div>
              <div class="descriptions-content">
                <j-input v-model:value="myRelation.relationTypeName" placeholder="请为关系命名" @change="relationChange" />
              </div>
            </div>
          </div>
        </div>
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
        <div class="title">
          开启资产
        </div>
        <div >
          <div>
            <j-switch v-model:checked="myAsset.enabled" style="margin-bottom: 24px" />
          </div>

          <div style="margin-bottom: 24px">
            <j-radio-group :value="myAsset.correlatesAssets ? 'true' : 'false'" button-style="solid" @change="assetChange">
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
                <j-select style="width: 100%;" v-model:value="myAsset.assetIdColumn" :options="columnOptions" @change="assetChange" />
              </div>
            </div>
            <div class="descriptions-item">
              <div class="descriptions-title" style="padding: 4px 8px;text-align: left">
                资产标识
              </div>
              <div class="descriptions-content">
                <j-input v-model:value="myAsset.assetType" @change="assetChange" />
              </div>
            </div>
            <div class="descriptions-item">
              <div class="descriptions-title" style="padding: 4px 8px;text-align: left">
                资产名称
              </div>
              <div class="descriptions-content">
                <j-input v-model:value="myAsset.assetTypeName" @change="assetChange" />
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
                <j-select style="width: 100%;" v-model:value="myAsset.assetTypeName" :options="options" :fieldNames="{ label: 'name', value: 'id'}" @change="assetChange" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="api">

    </div>
  </div>
</template>

<script setup name="CRUDAdvanced">
import { getAssetType } from '@/api/basis'
import { useRequest } from '@jetlinks/hooks'
import {CRUD_COLUMNS} from "@/components/Database/util";

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
  }
})

const CrudColumns = inject(CRUD_COLUMNS)

const emit = defineEmits(['update:tree','update:asset','update:relation', 'update'])

const { data:options } = useRequest(getAssetType)

const columnOptions = computed(() => {
  return CrudColumns.value.map(item => ({ label: item.name, value: item.name}))
})

const myRelation = reactive(props.relation || {
  enabled: true,
  relationType: undefined,
  relationTypeName: undefined
})

const myAsset = reactive(props.asset || {
  enabled: false,
  assetIdColumn: undefined,
  assetType: undefined,
  assetTypeName: undefined,
  correlatesAssets: false
})

const myTree = ref(props.tree || false)

const assetChange = (v) => {
  myAsset.correlatesAssets = v.target.value === 'true'
  emit('update:asset', myAsset)
  emit('update')
}

const treeChange = () => {
  console.log(myTree.value)
  emit('update:tree', myTree.value)
  emit('update')
}

const relationChange = () => {
  emit('update:relation', myRelation)
  emit('update')
}

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
    flex-basis: 320px;
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
