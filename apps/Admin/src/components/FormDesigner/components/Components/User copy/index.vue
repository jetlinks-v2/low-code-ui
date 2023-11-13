<template>
  <div>
    <!-- <j-select
      placeholder="请选择"
      :value="__value"
      :open="false"
      :showArrow="false"
      @focus="showModal"
      :options="selectOptions"
      :mode="mode"
      :disabled="disabled"
      :size="size"
      @change="onChange"
      style="width: 100%"
    >
    </j-select> -->
    <j-button type="primary" @click="showModal">用户选择</j-button>
    <div style="margin-top: 10px">
      <j-tag v-for="item in __value" :key="item?.value">
        <div style="display: flex">
          {{ item?.label }}
          <div @click="cancelSelect(item?.value)" style="margin-left: 10px">
            <AIcon type="CloseOutlined" class="selectItemIcon" />
          </div>
        </div>
      </j-tag>
    </div>
    <UserChoice
      v-if="modalVisible"
      @closeModal="closeModal"
      @selectedUser="selectedUser"
      :selected="selectData"
      :mode="mode"
    ></UserChoice>
  </div>
</template>

<script lang="ts" setup>
import UserChoice from './UserChoice.vue'
import { getUser_PaginateNot } from '@/api/form'
import { ref, watch, computed } from 'vue'
import { map } from 'lodash-es'

const props = defineProps({
  value: {
    type: Array,
    default: [],
  },
  mode: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: '',
  },
  keys: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:value', 'change'])

const selectData: any = ref()
const modalVisible = ref(false)
const selectOptions = ref([])

const showModal = () => {
  modalVisible.value = true
}
const closeModal = () => {
  modalVisible.value = false
}

// const __value = computed(() => {
//   if (props.mode !== 'multiple') {
//     return selectData.value?.id
//   } else {
//     return map(selectData.value, 'id')
//   }
// })

const __value = computed(() => {
  let arr: any[] = []
  if (props.mode !== 'multiple') {
    arr = [selectData.value?.id]
  } else {
    arr = map(selectData.value, 'id')
  }
  return selectOptions.value.filter((item: any) => {
    return arr.includes(item?.value)
  })
})

const _getObj = (value: any) => {
  const obj = {}
  props.keys.map((item: any) => {
    if (item?.key) {
      obj[item.key] = value?.[item?.key]
    }
  })
  return obj
}

const saveData = (data: any[]) => {
  if (props.mode !== 'multiple') {
    emit('update:value', _getObj(data?.[0]))
  } else {
    const arr = data.map((i) => {
      return _getObj(i)
    })
    emit('update:value', arr)
  }
  emit('change')
}
const selectedUser = (data: any[]) => {
  saveData(data)
  modalVisible.value = false
}

const queryUser = () => {
  getUser_PaginateNot({
    paging: false,
  }).then((res: any) => {
    if (res.status === 200) {
      selectOptions.value = res.result.map((item: any) => {
        return {
          label: item.name,
          value: item.id,
        }
      })
    }
  })
}

queryUser()

// const onChange = (_val: any) => {
//   const _arr = selectData.value.filter((i) => _val.includes(i.id))
//   saveData(_arr)
// }

const cancelSelect = (val: string) => {
  const index = selectData.value.findIndex((item: any) => item?.id === val)
  selectData.value.splice(index, 1)
  saveData(selectData.value)
}

watch(
  () => props.value,
  () => {
    if (props.mode !== 'multiple') {
      selectData.value = Array.isArray(props?.value)
        ? [props.value?.[0]]
        : props.value
    } else {
      selectData.value = Array.isArray(props?.value) ? props?.value : []
    }
  },
  {
    deep: true,
    // immediate:true
  },
)
</script>
<style lang="less" scoped>
.selectItemIcon {
  color: #333333;
  font-size: 10px;
}
</style>
