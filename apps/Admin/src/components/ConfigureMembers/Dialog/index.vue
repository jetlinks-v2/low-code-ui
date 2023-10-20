<!-- 配置成员 -->
<template>
  <j-modal
    visible
    title="配置成员"
    width="70vw"
    @ok="confirm"
    @cancel="emits('update:visible', false)"
  >
    <div :class="{ 'men-body': !isNode }">
      <!-- 组织维度 -->
      <div class="dimensions" v-if="!show || !isNode">
        <j-radio-group
          v-model:value="type"
          button-style="solid"
          class="radio"
          :style="isNode ? '' : radioStyle"
        >
          <j-radio-button
            v-for="item in dimensions"
            :value="item.value"
            :key="item.value"
            :class="{ active: type === item.value }"
            :style="{height: isNode ? '98px' : '117px'}"
          >
            <j-space>
              <div class="icon">
                <img :src="getImage(`/members/${item.value}.png`)" style="height: 18px;">
              </div>
              <div class="text">
                <div class="left-item-title">
                  {{ item.name }}
                </div>
                <span class="description">
                  <j-ellipsis line-clamp="3">{{ item.description }}</j-ellipsis>
                </span>
                </div>
            </j-space>
          </j-radio-button>
        </j-radio-group>
      </div>
      <!-- 配置 -->
      <MemberSelect
        v-show="show || !isNode"
        ref="selectRef"
        :type="type"
        :showSearch="type === 'user' || type === 'role'"
        @back="back"
      />
    </div>
  </j-modal>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import MemberSelect from '../components/MemberSelect.vue'
import { DataSourceProps } from '../types'
import { getImage } from '@jetlinks/utils';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  isNode: {
    type: Boolean,
    default: false,
  },
  iconType: {
    type: Object as PropType<any>,
    default: () => {},
  },
})

const emits = defineEmits<{
  (e: 'update:visible', newVisible: boolean): void
  (e: 'get-data', data: DataSourceProps[], key: string): void
}>()

const radioStyle = {
  flexDirection: 'column',
  width: '248px',
  marginRight: '16px',
}
const dimensions = [
  {
    id: '1',
    name: '组织',
    value: 'org',
    description: '从组织维度划分可发起流程的成员',
    checked: true,
    // icon: 'icon-fl-zuzhi',
  },
  {
    id: '2',
    name: '用户',
    value: 'user',
    description: '从用户维度划分可发起流程的成员',
    checked: false,
    // icon: 'icon-pingzheng',
  },
  {
    id: '3',
    name: '角色',
    value: 'role',
    description: '从角色维度划分可发起流程的成员',
    checked: false,
    // icon: 'icon-yonghu2',
  },
]
// 选中的维度
const type = ref<string>(props.isNode ? '' : 'org')
const show = ref<boolean>(false)
// 点击次数
const count = ref<number>(0)

const selectRef = ref<any>()
const confirm = () => {
  if (!type.value) return
  if (props.isNode) {
    if (count.value) {
      submit()
    } else {
      show.value = true
      count.value++
    }
  } else {
    submit()
  }
}

const submit = () => {
  emits('get-data', selectRef.value?.dataSource, type.value)
  emits('update:visible', false)
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
.men-body {
  display: flex;
}
.dimensions {
  display: flex;
  justify-content: center;
  // min-height: 170px;
  // height: 367px;

  .radio {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    .ant-radio-button-wrapper {
      flex-direction: column;
      display: flex;
      align-items: center;
      justify-content: center;
      // height: 98px;
      // height: c;
      padding: 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background-color: #f6f7f9;
      &.active {
        color: #fff !important;
        background: #315efb;
        .icon{
          background: #fff;
        }
      }
      &::before {
        content: none;
      }
      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background: #dee2eb;
      }

      .text {
        .left-item-title {
          font-size: 18px;
          font-weight: 500;
          line-height: 24px;
        }
        .description {
          line-height: 20px;
        }
      }
    }
  }
}
</style>
