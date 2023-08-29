<template>
  <div class="data-bind">
    <j-form :model="dataBind" layout="inline">
      <j-form-item label="数据绑定">
        <j-select
          v-model:value="dataBind.data.function"
          style="width: 200px"
          :disabled="functionDisabled"
          placeholder="请选择功能"
        >
          <j-select-option
            v-for="item in functions"
            :value="item.id"
            :key="item.id"
          >
            {{ item.name }}
          </j-select-option>
        </j-select>
      </j-form-item>
      <j-form-item v-if="showCommand">
        <j-select
          v-model:value="dataBind.data.command"
          :disabled="commandDisabled"
          style="width: 200px"
        >
        <j-select-option
          v-for="item in commands"
          :value="item.id"
          :key="item.id"
        >
          {{ item.name }}
        </j-select-option>
      </j-select>
      </j-form-item>
      <j-form-item>
        <j-button type="link" @click="handleModify">变更</j-button>
      </j-form-item>
      <j-form-item>
        <j-button type="link" @click="handleValid">校验</j-button>
      </j-form-item>
      <j-form-item v-if="!open">
        <j-button @click="emits('update:open', true)">操作向导</j-button>
      </j-form-item>
    </j-form>
    <j-modal v-model:visible="visible" title="提示" @ok="handleOk">
      <p class="text">
        变更后将清空筛选组件及数据列表的所有数据<br />确认变更？
      </p>
    </j-modal>
  </div>
</template>

<script setup lang="ts" name="DataBind">
import { useProduct } from '@/store'
import { storeToRefs } from 'pinia'
import { queryCommand } from '@/api/project'
import { functionsKey, DATA_BIND } from '../keys';

const visible = ref(false)
const handleValid = () => {
  emits('valid')
}

interface Emit {
  (e: 'update:open', value: boolean): void
  (e: 'valid'): void
  (e: 'modify'): void
}

const emits = defineEmits<Emit>()
const dataBind = inject(DATA_BIND)
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const { data } = storeToRefs(useProduct())

const functionDisabled = computed(() => {
  return dataBind.data.function && dataBind.data.function !== ''
})

const commandDisabled = computed(() => {
  return dataBind.data.command && dataBind.data.command !== ''
})

const showCommand = computed(() => {
  return ['rdb-sql-query', 'rdb-crud'].includes(functions!.value.find(item => item.id === dataBind.data.function)?.provider || '')
})

const functions = inject(functionsKey)

const commands = ref([
  { name: '新增数据', id: 'Add' },
  { name: '导入数据', id: 'Import' },
  { name: '导出数据', id: 'Export' },
  { name: '删除数据', id: 'Delete' },
  { name: '更新数据', id: 'Update' },
])

/**查询功能下的指令 */
const findCommand = async () => {
  const params = {
    modules: [
        {
        id: data.value?.[0].id,
        name: data.value?.[0].name,
        functions: functions!.value?.filter(item => item.id === dataBind.data.function)
      }
    ]
  }
  const res = await queryCommand(params)
  if(res.success) {
    commands.value = res.result?.[0]?.command
  }
}

const handleModify = () => {
  if(dataBind?.data?.function !== ''){
    visible.value = true
  }
}

const handleOk = () => {
  emits('modify')
  visible.value = false
}


watchEffect(() => {
  if(dataBind?.data?.function) {
    dataBind.functionInfo = functions!.value.find(item => item.id === dataBind.data.function)
    findCommand();
  }
})

/**树形结构转一维数组 */
</script>

<style scoped lang="less">
.data-bind {
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 1px 4px #0015291f;
  margin-bottom: 5px;
}
.text {
  text-align: center;
}
</style>
