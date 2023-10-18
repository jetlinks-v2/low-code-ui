<template>
  <Content>
    <template v-for="(item, index) in relationList" :key="item.relation">
      <TitleComponent :data="item.name"></TitleComponent>
      <j-button style="width: 100%" @click="visible = true">配置</j-button>
      <j-divider />
      <j-modal
        :title="`配置${item.name}`"
        :visible="visible"
        width="50%"
        @cancel="visible = false"
        @ok="submit(index, item)"
      >
        <ListChoose
          :columns="columns"
          :list="list"
          :fieldNames="{ title: 'name', key: 'id' }"
          :dataSource="
            relations.find((val) => val.relation === item.relation)?.related
          "
          ref="listChoose"
        />
      </j-modal>
    </template>
  </Content>
</template>

<script setup lang="ts">
import Content from './Content.vue'
import ListChoose from './ListChoose.vue'
import { saveRelationApi } from '@/api/list'

const props = defineProps({
  relationList: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  relations: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  relation: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  query: {
    type: Function,
  },
  params: {
    type: Array,
    default: () => []
  },
  preview: {
    type: Boolean,
    default: true,
  }
})

const columns = [
  {
    title: '用户',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: '100px',
  },
]

const listChoose = ref()
const visible = ref(false)

const list = ref([])
const getUserList = async () => {
  const res = await props.query?.(...props.params)
  if (res.success) {
    list.value = res.result
  }
}

const submit = async (index: number, _item: any) => {
  if(!props.preview) {
    visible.value = false
    return
  }
  const data = [
    {
      relatedType: 'user',
      relation: _item.relation,
      related: listChoose.value?.[index].chosenArr,
    },
  ]
  const res = await saveRelationApi(props.relation, props.id, data)
  if (res.success) {
    visible.value = false
  }
}

onMounted(() => {
  if(!props.preview) {
    getUserList()
  }
})
</script>
