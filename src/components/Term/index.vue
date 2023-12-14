<template>
  <div>
    <j-form ref="formRef" :model="form" class="my-form">
      <j-space
        v-for="(item, index) in form.term"
        :key="item.key"
        style="display: flex; margin-bottom: 8px"
        align="baseline"
        class="term"
      >
        <div class="term-item">
          <j-form-item
            :name="['term', index, 'column']"
            label=""
            :rules="{
              required: true,
              message: '请配置变量',
            }"
          >
            <j-tree-select
              :showArrow="false"
              v-model:value="item.column"
              :tree-data="variableData"
              style="min-width: 120px"
              placeholder="请配置变量"
              :dropdownMatchSelectWidth="false"
              :dropdown-style="{
                maxHeight: '400px',
                overflow: 'auto',
                minWidth: '300px',
              }"
              :fieldNames="
                fieldNames ?? {
                  children: 'children',
                  label: 'fullName',
                  value: 'column',
                }
              "
              tree-node-filter-prop="label"
              @select="(value, node) => selectVariable(value, node, index)"
 
            >
              <template #title="{ fullName, description }">
                <j-space>
                  <span>{{ fullName }}</span>
                  <span style="color: #bab9b9">{{ description }}</span>
                </j-space>
              </template>
            </j-tree-select>
          </j-form-item>
          <j-form-item
            label=""
            :name="['term', index, 'operator']"
            :rules="{
              required: true,
              message: '请选择',
            }"
          >
            <!-- <j-select
              :showArrow="false"
              v-model:value="item.operator"
              :options="operatorList[index]"
              :fieldNames="{ label: 'name', value: 'id' }"
              :dropdownMatchSelectWidth="false"
              style="min-width: 60px"
              placeholder="操作符"
            ></j-select> -->
            <j-select
              :showArrow="false"
              v-model:value="item.operator"
              :options="operatorList(item.column, index)"
              :fieldNames="{ label: 'name', value: 'id' }"
              :dropdownMatchSelectWidth="false"
              style="min-width: 60px"
              placeholder="操作符"
            ></j-select>
          </j-form-item>
          <j-form-item
            label=""
            :name="['term', index, 'value']"
            :rules="{
              required: true,
              message: '请输入',
            }"
          >
            <!-- <j-input
              style="width: 120px"
              v-model:value="item.value"
              :maxlength="64"
              placeholder="参数值"
            /> -->
            <ValueItem
              style="width: 120px"
              v-model:modelValue="item.value"
              :itemType="item.type"
              :options="
                item.type === 'boolean'
                  ? [
                      { label: '是', value: true },
                      { label: '否', value: false },
                    ]
                  : undefined
              "
              :isMultiple="
                item.operator === 'in' || item.operator === 'nin'
                  ? 'multiple'
                  : undefined
              "
            />
          </j-form-item>
          <div class="del-term" v-show="form.term.length > 1">
            <j-popconfirm
              title="确认删除？"
              @confirm="delTerm(index)"
              :overlayStyle="{ minWidth: '180px' }"
            >
              <AIcon type="CloseOutlined" />
            </j-popconfirm>
          </div>
        </div>
        <!-- 新增条件 -->
        <div
          v-if="form.term.length - 1 === index"
          class="addTerm"
          @click="addTerm(index)"
        >
          <AIcon type="PlusOutlined" />
        </div>
        <!-- 单组条件连接符 -->
        <div v-else>
          <j-form-item
            label=""
            :name="['term', index, 'inner']"
            :rules="{
              required: true,
              message: '请选择',
            }"
          >
            <j-select
              :showArrow="false"
              v-model:value="item.inner"
              style="min-width: 60px"
              :options="[
                { label: '并且', value: '&&' },
                { label: '或者', value: '||' },
              ]"
              placeholder="请选择"
            ></j-select>
          </j-form-item>
        </div>
      </j-space>
    </j-form>
  </div>
</template>
<script setup lang="ts">
import ValueItem from './ValueItem/index.vue'
import type { TreeSelectProps } from 'ant-design-vue'

interface TermProps {
  column: string | undefined
  type: string | undefined
  operator: string | undefined
  value: string | undefined | string[]
  inner: string
  key?: number
}

const props = defineProps<{
  variableData: TreeSelectProps[]
  fieldNames?: { children: string; label: string; value: string }
  formData: TermProps[]
}>()

/**
 * 将树形结构数据扁平化
 * @param tree
 */
const flattenTree = (tree: any[]) => {
  return tree.reduce((pre: any[], cur: any) => {
    pre.push(cur)
    if (cur.children) {
      pre = pre.concat(flattenTree(cur.children))
    }
    return pre
  }, [])
}

const formRef = ref()
// 扁平化后的树形数据
const treeData = computed(() => {
  return flattenTree(props.variableData)
})
// const operatorList= ref({})
const operatorList = computed(
  () => (column: string | undefined, index: number) => {
    // 从treeData找出column字段等于参数column的项
    const data = treeData.value.filter((item: any) => item.column === column)[0]
    form.term[index].type = data?.dataType
    return data?.termTypes
  },
)
const form = reactive({
  term: [
    {
      column: undefined, // 属性
      type: undefined,
      operator: undefined, // 操作符
      value: undefined, // 参数值
      inner: '&&',
      key: Date.now(),
    },
  ] as TermProps[],
})

/**
 * 删除条件
 * @param index
 */
const delTerm = (index) => {
  form.term.splice(index, 1)
}

/**
 * 新增条件
 * @param index
 */
const addTerm = (index: number) => {
  form.term.splice(index + 1, 0, {
    column: undefined, // 属性
    type: undefined,
    operator: undefined, // 操作符
    value: undefined, // 参数值
    inner: '&&',
    key: Date.now(),
  })
}


// const change  = (value, labelNode, extra) =>{
//   const v = extra.triggerNode.props.fullName;
//   value.label =  v
//   console.log(`output->`,v)
//     }
/**
 * 变量选择
 */
const selectVariable = (value, node, index: number) => {
  // console.log(`output->value,node`, value, node)
  console.log(`output->value`,value)
  form.term[index].operator = undefined
  form.term[index].value = undefined
  // form.term[index].type = node.type
  operatorList.value[index] = node.termTypes
}

const validate = async () => {
  // return formRef.value?.validate()
  await formRef.value?.validate()
  return form.term
}
defineExpose({
  validate,
})

watch(
  () => props.formData,
  (val) => {
    form.term = [...val]
  },
  { immediate: true },
)
</script>
<style scoped lang="less">
.my-form {
  // display: flex;
  // flex-wrap: wrap;

  .term {
    .term-item {
      position: relative;
      display: inline-flex;
      gap: 10px;
      // border: 1px dashed #e8e8e8;

      &:hover .del-term {
        display: block;
      }
      .del-term {
        display: none;
        position: absolute;
        top: -10px;
        right: -10px;
        width: 20px;
        height: 20px;
        color: #999;
        line-height: 20px;
        border-radius: 50%;
        text-align: center;
        background-color: #f1f1f1;
      }
    }

    .addTerm {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 32px;
      border: 1px dashed #d9d9d9;
    }
  }
}
</style>
