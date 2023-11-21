<template>
  <Content>
    <template v-for="(item, index) in relationList" :key="item.relation">
      <TitleComponent :data="item.name"></TitleComponent>
      <j-button style="width: 100%" @click="visible = true">配置</j-button>
      <j-divider />
      <j-modal
        :title="`配置${item.name}`"
        :visible="visible"
        destroyOnClose
        width="50%"
        @cancel="visible = false"
        @ok="submit(index, item)"
      >
        <CardChoose
          :type="targetType"
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
import CardChoose from './CardChoose.vue'
import { getDepartmentList_api } from '@/api/user'
import { saveRelationApi } from '@/api/list'
import { pick } from 'lodash-es';

const props = defineProps({
  /**两个关系类型下的所有关系配置 */
  relationList: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  /**当前数据下已配置的关系 */
  relations: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  /**源类型标识 */
  relation: {
    type: String,
    default: '',
  },
  /**关联方数据ID */
  id: {
    type: String,
    default: '',
  },
  /**是否预览 */
  preview: {
    type: Boolean,
    default: true,
  },
  /**目标类型标识 */
  targetType: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update'])
const listChoose = ref()
const visible = ref(false)

const list = ref([])
const getUserList = async () => {
  const res = await getDepartmentList_api()
  if (res.success) {
    list.value = res.result
  }
}

const submit = async (index: number, _item: any) => {
  if(props.preview) {
    visible.value = false
    return
  }
  const data = [
    {
      relatedType: props.targetType,
      relation: _item.relation,
      related: listChoose.value?.[index]._selectedRows?.map(item => pick(item, ['id', 'name'])),
    },
  ]
  const res = await saveRelationApi(props.relation, props.id, data)
  if (res.success) {
    visible.value = false
    emit('update')
  }
}

onMounted(() => {
  getUserList()
})
</script>
