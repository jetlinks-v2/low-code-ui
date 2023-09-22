<template>
  <j-drawer
    visible
    title="配置"
    placement="right"
    :style="{ position: 'absolute', zIndex: 1030 }"
    :closable="false"
    :width="500"
    :get-container="warp"
    @close="cancel"
  >
    <j-form
      ref="formRef"
      :model="formModel"
      layout="vertical"
    >
      <component :is="componentName" />
    </j-form>
    <template #footer>
      <j-button style="margin-right: 8px" @click="cancel">取消</j-button>
      <j-button type="primary" @click="save">确定</j-button>
    </template>
  </j-drawer>
</template>

<script setup name="TypeModal">
import EnumItem from './Enum.vue'
import ListItem from './List.vue'
import MapItem from './Map.vue'
import NumberItem from './Number.vue'
import StringItem from './String.vue'
import { SETTING_FORM_MODEL, SETTING_FORM_REF } from '../../util'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  warp: {
    type: Object
  }
})

const emit = defineEmits(['cancel', 'save'])

const formRef = ref()
const formModel = ref({})

provide(SETTING_FORM_MODEL, formModel)
provide(SETTING_FORM_REF, formRef)

const getContainer = () => {
  console.log(props.warp)
  return document.querySelector('.crud-warp')
}

const componentName = computed(() => {
  const { javaType } = props.data

  const spec = {
    canImport: false,
    canExport: false
  }
  console.log(javaType)
  switch(javaType) {
    case 'Enum':
      formModel.value = {
        dictionary: {
          dictionaryId: undefined,
          multiple: undefined
        },
        spec,
        ...props.data
      }
      return EnumItem;
    case 'String':
    case 'Byte':
    case 'Long':
      formModel.value = {
        defaultValueSpec: {
          fixValue: undefined
        },
        validator: {
          provider: undefined,
          configuration: {
            message: '数据格式错误',
            group: undefined
          }
        },
        spec,
        ...props.data
      }
      return StringItem;
    case 'Double':
    case 'Integer':
    case 'Float':
    case 'BigDecimal':
    case 'BigInteger':
      formModel.value = {
        defaultValueSpec: {
          fixValue: undefined
        },
        validator: {
          provider: undefined,
          configuration: {
            message: '数据格式错误',
            group: undefined,
            classType: javaType,
            regexp: undefined,
            min: undefined,
            max: undefined
          }
        },
        spec,
        ...props.data
      }
      return NumberItem;
    case 'List':
      formModel.value = {
        others: {
          valueJavaType: undefined
        },
        spec,
        ...props.data
      }
      return ListItem;
    case 'Map':
      formModel.value = {
        others: {
          keyJavaType: undefined,
          valueJavaType: undefined
        },
        spec,
        ...props.data
      }
      return MapItem;
  }
})

const cancel = () => {
  emit('cancel')
}
const save = () => {
  formRef.value.validate().then(res => {
    if (res) {
      emit('save', {
        ...props.data,
        ...formModel.value
      })
    }
  })
}

</script>

<style scoped>

</style>
