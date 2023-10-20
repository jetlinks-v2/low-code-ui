<template>
  <div>
    <j-button style="width: 100%" @click="visible = true">配置</j-button>
    <j-modal
      v-model:visible="visible"
      title="存储配置"
      @cancel="visible = false"
    >
      <div v-if="configVisible">
        <div>请选择{{ config?.key }}存储位置</div>
        <div class="box">
          <j-form ref="formRef" :model="config" layout="vertical">
            <j-form-item
              :validateFirst="true"
              :name="['config', 'projectId']"
              :rules="rulesProject"
            >
              <j-select
                v-model:value="config.config.projectId"
                placeholder="请选择"
                :options="projectList"
                allowClear
                showSearch
                @change="onProjectChange"
              >
              </j-select>
            </j-form-item>
            <j-form-item
              :validateFirst="true"
              :name="['config', 'functionId']"
              :rules="[
                {
                  message: '请选择',
                  required: true,
                },
              ]"
            >
              <j-select
                allowClear
                showSearch
                :options="functionList"
                placeholder="后端功能"
                v-model:value="config.config.functionId"
                style="width: 100%"
                @change="onFunChange"
              />
            </j-form-item>
            <j-form-item
              :validateFirst="true"
              :name="['config', 'commandId']"
              :rules="[
                {
                  message: '请选择',
                  required: true,
                },
              ]"
            >
              <j-select
                allowClear
                showSearch
                :options="commandList"
                v-model:value="config.config.commandId"
                placeholder="功能下指令"
                @change="onCommandChange"
              />
            </j-form-item>
            <j-form-item
              :validateFirst="true"
              :name="['config', 'source']"
              :rules="[
                {
                  message: '请选择',
                  required: true,
                },
              ]"
            >
              <j-tree-select
                allowClear
                showSearch
                :tree-data="sourceList"
                v-model:value="config.config.source"
                placeholder="数据选择"
              />
            </j-form-item>
          </j-form>
        </div>
      </div>
      <div class="box" v-else>
        <div>请配置设备选择组件需要存储的字段</div>
        <div class="box-search">
          <j-input-search
            placeholder="请输入"
            style="width: 100%"
            @search="onSearch"
          />
        </div>
        <div class="box-item" v-for="item in dataList" :key="item">
          <div
            class="box-item-content"
            @click="onClick(item)"
            :class="{
              'box-item-content': true,
              active: getKeys.includes(item),
            }"
          >
            <span>{{ item }}</span>
            <template v-if="getKeys.includes(item)">
              <j-space
                v-if="_value.find((i) => i.key === item)?.config?.source"
              >
                <span>{{
                  _value.find((i) => i.key === item)?.config?.source
                }}</span>
                <span @click.stop="onConfig(item)">修改</span>
              </j-space>
              <span @click.stop="onConfig(item)" v-else>配置</span>
            </template>
          </div>
          <div class="error" v-if="error.includes(item)">请配置存储位置</div>
        </div>
      </div>
      <template #footer>
        <j-space>
          <j-button @click="handleCancel">取消</j-button>
          <j-button @click="handleOk" type="primary">确认</j-button>
        </j-space>
      </template>
    </j-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, unref, watch } from 'vue'
import { map } from 'lodash-es'
import { onlyMessage } from '@jetlinks/utils'
import { product, role, org, device, user } from './index'
import { queryEndCommands, queryProject } from '@/api/form'

const _key = 'id'
const props = defineProps({
  value: {
    type: Array,
  },
  type: {
    type: String,
    default: 'device',
  },
})

const emits = defineEmits(['update:value', 'change'])
const visible = ref<boolean>(false)
const configVisible = ref<boolean>(false)
const error = ref<string[]>([])
const formRef = ref<any>()

const _value = ref<any[]>(
  props.value || [
    {
      key: _key,
      config: {},
    },
  ],
)

const config = ref<any>({})

const list = computed(() => {
  switch (props.type) {
    case 'product':
      return product
    case 'org':
      return org
    case 'role':
      return role
    case 'user':
      return user
    default:
      return device
  }
})

const dataList = ref<any[]>([...list.value])
const projectList = ref<any[]>([])
const end = ref<any[]>([])

const rulesProject = [
  {
    required: true,
    message: '请选择',
  },
  {
    validator(_rule: any, value: string) {
      const item = projectList.value?.find((i) => i?.value === value)
      if (!item) {
        return Promise.reject(`数据已被删除`)
      }
      return Promise.resolve()
    },
    trigger: 'change',
  },
]

const functionList = computed(() => {
  return (
    (end.value || []).map((item) => {
      return {
        label: item.name + '.' + item.id,
        value: item.id,
      }
    }) || []
  )
})

const commandList = computed(() => {
  return (
    (end.value || [])
      .find((item) => config.value?.config?.functionId === item.id)
      ?.command?.map((i) => {
        return {
          ...i,
          label: i.name,
          value: i.id,
        }
      }) || []
  )
})

const getKeys = computed(() => {
  return map(_value.value, 'key')
})

const getArray = (arr: any[]) => {
  return (arr || []).map((i) => {
    let children: any[] = []
    if (i.valueType.type === 'array') {
      children = getArray(i.valueType?.elementType?.properties || [])
    }
    if (i.valueType.type === 'object') {
      children = getArray(i.valueType?.properties || [])
    }
    return {
      value: i.id,
      label: `${i.id}${i?.name ? '(' + i?.name + ')' : ''}`,
      children,
    }
  })
}

const sourceList = computed(() => {
  const output =
    commandList.value.find(
      (item) => item.id === config.value?.config?.commandId,
    )?.output?.properties || []
  return getArray(output)
})

const onClick = (_val: any) => {
  if (_val === _key) return
  if (getKeys.value.includes(_val)) {
    const _index = _value.value.findIndex((i) => i?.key === _val)
    _value.value.splice(_index, 1)
  } else {
    _value.value.push({
      key: _val,
      config: {},
    })
  }
}

const onConfig = (_val: string) => {
  config.value = _value.value?.find((item) => item?.key === _val)
  configVisible.value = true
  if (!projectList.value?.length) {
    getProject()
  }
  if(config.value?.config?.projectId){
    getEnd(config.value?.config?.projectId)
  }
}

const handleOk = async () => {
  if (configVisible.value) {
    // 判断数据是否正确
    const resp = await formRef.value?.validateFields()
    if (resp) {
      const _index = _value.value?.findIndex(
        (item) => item?.key === config.value?.key,
      )
      if (_index !== -1) {
        _value.value[_index] = unref(config)
        configVisible.value = false
      }
    }
  } else {
    // 判断数据是否正确
    const _arr = _value.value.filter((i) => !i?.config?.source)
    if (_arr?.length) {
      onlyMessage('请配置存储位置', 'error')
      error.value = map(_arr, 'key')
    } else {
      emits('update:value', unref(_value))
      emits('change', unref(_value))
      visible.value = false
      error.value = []
    }
  }
}

const handleCancel = () => {
  if (configVisible.value) {
    configVisible.value = false
    config.value = {}
  } else {
    visible.value = false
    error.value = []
  }
}

const onFunChange = (val: string | undefined) => {
  config.value = {
    ...config.value,
    config: {
      ...config.value.config,
      functionId: val,
      commandId: undefined,
      source: undefined,
    },
  }
}

const onProjectChange = (val: string | undefined) => {
  if(val){
    getEnd(val)
  }
  config.value = {
    ...config.value,
    config: {
      projectId: val,
      functionId: undefined,
      commandId: undefined,
      source: undefined,
    },
  }
}

const onCommandChange = (val: string | undefined) => {
  config.value = {
    ...config.value,
    config: {
      ...config.value.config,
      commandId: val,
      source: undefined,
    },
  }
}

const onSearch = (searchValue: string) => {
  if (searchValue) {
    dataList.value = list.value.filter(
      (item) => item.indexOf(searchValue) !== -1,
    )
  } else {
    dataList.value = list.value
  }
}

const getProject = () => {
  queryProject().then((resp) => {
    if (resp.success) {
      projectList.value = resp.result.map((item) => {
        return {
          modules: item.modules || [],
          label: item.name,
          value: item.id,
        }
      })
    }
  })
}

const getEnd = (id: string) => {
  queryEndCommands(id, []).then((resp) => {
    if (resp.success) {
      end.value = resp.result || []
    }
  })
}

watch(
  () => props?.value,
  () => {
    _value.value = props?.value?.length
      ? props.value
      : [
          {
            key: _key,
            config: {},
            flag: true,
          },
        ]
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>

<style lang="less" scoped>
.box {
  background-color: #bfbfbf33;
  padding: 10px;
  height: 350px;
  overflow-y: auto;

  .box-item {
    .box-item-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      margin: 5px 0;
      padding: 5px;
      cursor: pointer;

      &:hover {
        background-color: @primary-color-hover;
        color: #fff;
      }
      &.active {
        background-color: @primary-color-active;
        color: #fff;
      }
    }

    .error {
      color: red;
    }
  }
}
</style>