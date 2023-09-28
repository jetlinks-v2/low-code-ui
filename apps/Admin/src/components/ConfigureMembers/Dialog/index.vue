<!-- 配置成员 -->
<template>
  <j-modal
    visible
    title="配置成员"
    width="65%"
    @ok="confirm"
    @cancel="emits('update:visible', false)"
  >
    <!-- 组织维度 -->
    <div class="dimensions" v-if="!show">
      <j-space v-for="item of dimensions" :key="item.id">
        <div
          class="dimension-item"
          :class="{ active: type === item.value }"
          @click="handleClick(item.value)"
        >
          <span class="dimension-item-title-icon">
            <AIcon :type="item.icon" />
          </span>
          <div class="dimension-item-title">
            {{ item.name }}
          </div>
          <span>{{ item.description }}</span>
        </div>
      </j-space>
    </div>
    <!-- 配置 -->
    <MemberSelect
      ref="selectRef"
      v-else
      :type="type"
      :showSearch="type === 'user' || type === 'role'"
      @back="back"
    />
  </j-modal>
</template>
<script setup lang="ts">
import MemberSelect from '../components/MemberSelect.vue'
import { DataSourceProps } from '../types'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits<{
  (e: 'update:visible', newVisible: boolean): void
  (e: 'get-data', data: DataSourceProps[], key: string): void
}>()

const dimensions = [
  {
    id: '1',
    name: '组织',
    value: 'org',
    description: '从组织维度划分候选人范围',
    checked: true,
    icon: 'ClusterOutlined',
  },
  {
    id: '2',
    name: '用户',
    value: 'user',
    description: '从用户维度划分候选人范围',
    checked: false,
    icon: 'UserOutlined',
  },
  {
    id: '3',
    name: '角色',
    value: 'role',
    description: '从角色维度划分候选人范围',
    checked: false,
    icon: 'TeamOutlined',
  },
]
// 选中的维度
const type = ref<string>('')
const show = ref<boolean>(false)
// 点击次数
const count = ref<number>(0)
/**
 *
 * @string key 维度值
 */
const handleClick = (key: string) => {
  type.value = key
}
const selectRef = ref<any>()
const confirm = () => {
  if (!type.value) return
  if (!count.value) {
    show.value = true
  } else {
    emits('get-data', selectRef.value?.dataSource, type.value)
    emits('update:visible', false)
  }
  count.value++
}

/**
 * 返回
 */
const back = () => {
  show.value = false
  count.value = 0
}
</script>
<style scoped lang="less">
.dimensions {
  display: flex;
  gap: 8px;
  justify-content: center;
  min-height: 400px;

  .dimension-item {
    background: #f0f2f5;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    cursor: pointer;
    &:hover {
      background: #bfe9fb;
      transition: all 0.5s;
    }
    .dimension-item-title-icon {
      font-size: 20px;
    }
  }

  .active {
    background: #bfe9fb;
  }
}
</style>
