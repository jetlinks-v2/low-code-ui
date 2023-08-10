<template>
  <div className="filter-module-center">
    <j-button @click="open = true">open</j-button>
    <j-drawer
      title="配置"
      placement="bottom"
      :closable="false"
      :visible="open"
      @close="onClose"
      height="520px"
    >
      <Table @configuration="configuration" v-if="type === ''" />
      <div v-else>
        <a-page-header
          title="配置筛选项"
          sub-title="配置筛选项"
          @back="type = ''"
        >
          <template #backIcon>
            <AIcon type="LeftOutlined" />
            返回
          </template>
        </a-page-header>
        <EnumType v-if="type === 'enum'" />
        <StringType v-if="type === 'string'" />
        <NumberType v-if="type === 'number'" />
        <DateType v-if="type === 'date'" />
      </div>

      <template #footer v-if="type !== ''">
        <j-button style="float: right" type="primary" @click="submit">
          确定
        </j-button>
        <j-button style="float: right; margin-right: 8px" @click="type = ''">
          取消
        </j-button>
      </template>
    </j-drawer>
  </div>
</template>

<script lang="ts" setup>
import Table from '@/components/ListPage/FilterModule/components/FilterTable.vue'
import EnumType from '@/components/ListPage/FilterModule/components/EnumType.vue'
import StringType from '@/components/ListPage/FilterModule/components/StringType.vue'
import NumberType from '@/components/ListPage/FilterModule/components/NumberType.vue'
import DateType from '@/components/ListPage/FilterModule/components/DateType.vue'
import { useConfigurationStore } from '@/store/filterModule'
import { ref } from 'vue'

const open = ref<boolean>(true)
const type = ref('')
const configurationStore = useConfigurationStore()
const configuration = (data: any) => {
  type.value = data?.record?.type
  console.log(data)
}
const submit = () => {
  const aa = configurationStore.getConfigurationInfo(type.value)
  console.log(aa)
  type.value = ''
}
</script>

<style scoped lang="less"></style>
