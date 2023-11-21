<template>
  <div>
    <j-drawer
      title="列表数据配置"
      placement="right"
      width="560px"
      :closable="true"
      :visible="open"
      @close="emits('update:open', false)"
    >
      <j-tabs v-model:activeKey="activeKey" type="card" :destroyInactiveTabPane="true">
        <j-tab-pane v-for="item in typeList" :key="item.id" :tab="item.name">
          <CardType
            v-if="['device', 'product'].includes(item.id)"
            :relationList="relationList"
            :relations="relations"
            :id="data?.id"
            :targetType="item.id"
            :relation="props.config.relation"
            :preview="preview"
            @update="() => getRelation()"
          />
          <ListType
            v-else
            :relationList="relationList"
            :relations="relations"
            :id="data?.id"
            :typeId="item.id"
            :query="query(item.id)"
            :params="params(item.id)"
            :relation="props.config.relation"
            :preview="preview"
            @update="() => getRelation()"
          />
        </j-tab-pane>
        <!-- <j-tab-pane tab="用户" key="user">
          <User :relationList="relationList" :relations="relations" :id="data.id" :relation="props.config.relation?.relationType" />
        </j-tab-pane>
        <j-tab-pane tab="产品" key="product">
          <Product :relationList="relationList" :relations="relations" :id="data.id" :relation="props.config.relation?.relationType" />
        </j-tab-pane>
        <j-tab-pane tab="设备" key="device">
          <Device :relationList="relationList" :relations="relations" :id="data.id" :relation="props.config.relation?.relationType" />
        </j-tab-pane>
        <j-tab-pane tab="组织" key="org">
          <Origination :relationList="relationList" :relations="relations" :id="data.id" :relation="props.config.relation?.relationType" />
        </j-tab-pane>
        <j-tab-pane tab="角色" key="role">
          <Role :relationList="relationList" :relations="relations" :id="data.id" :relation="props.config.relation?.relationType" />
        </j-tab-pane> -->
      </j-tabs>
    </j-drawer>
  </div>
</template>
<script setup lang="ts">
import ListType from './ListType.vue'
import CardType from './CardType.vue'
import { relationListApi, relationApi, relationTypeListApi, userList } from '@LowCode/api/list'
import { queryRuntime } from '@LowCode/api/form'
import { getRoleList_api, getDepartmentList_api } from '@LowCode/api/user'
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  config: {
    type: Object as PropType<Record<string, any>>,
    default: () => {},
  },
  data: {
    type: Object as PropType<Record<string, any>>,
    default: () => {},
  },
  projectId: {
    type: String,
    default: '',
  },
  preview: {
    type: Boolean,
    default: true,
  }
})

type Emits = {
  (e: 'update:open', open: boolean): void
}

const query = (targetType: string) => {
  switch(targetType) {
    case 'user':
      return userList
    case 'role':
      return getRoleList_api
    case 'org':
      return getDepartmentList_api
    default:
      return queryRuntime
  }
}

const params = (targetType: string) => {
  switch(targetType) {
    case 'user':
      return [{}]
    case 'role':
      return [{}]
    case 'org':
      return [{}]
    default:
      return [props.projectId, props.config.functions, 'QueryList', {}]
  }
}

const emits = defineEmits<Emits>()
const open = computed({
  get() {
    return props.open
  },
  set(val) {
    emits('update:open', val)
  },
})

interface TypeListProp {
  id: string
  name: string
  description: string
}
const activeKey = ref('user')
const relationList = ref([])
const typeList = ref<TypeListProp[]>([])
const getRelationList = async (objectType: string, targetType: string) => {
  const res = await relationListApi(objectType, targetType)
  if (res.success) {
    relationList.value = res.result
  }
}

const relations = ref<Record<string, any>[]>([])
const getRelation = async () => {
  const res = await relationApi(
    props.config?.relation,
    props.data?.id,
  )
  if (res.success) {
    relations.value = res.result
  }
}

const getTypeList = async () => {
  const res = await relationTypeListApi()
  if (res.success) {
    typeList.value = res.result
  }
}
getTypeList()
watchEffect(() => {
  if (props.config?.relation && !props.config.preview) {
    getRelationList(props.config.relation, activeKey.value)
    getRelation()
  }
})
</script>
