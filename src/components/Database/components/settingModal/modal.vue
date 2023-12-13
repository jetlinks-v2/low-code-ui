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
    <j-scrollbar>
      <j-form
        ref="formRef"
        :model="formModel"
        layout="vertical"
      >
        <component :is="componentName" :warp="warp" :publish="publish" />
      </j-form>
    </j-scrollbar>
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
import BooleanItem from './Boolean.vue'
import { SETTING_FORM_MODEL, SETTING_FORM_REF } from '../../util'
import { omit } from 'lodash-es'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  warp: {
    type: Object
  },
  publish: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['cancel', 'save'])

const formRef = ref()
const formModel = ref({})

provide(SETTING_FORM_MODEL, formModel)
provide(SETTING_FORM_REF, formRef)

const componentName = computed(() => {
  const { javaType } = props.data

  const spec = {
    canImport: false,
    canExport: false
  }

  const conditionData = props.data.defaultValueSpec?.template?.parts[0].condition.condition

  switch(javaType) {
    case 'Enum':
      formModel.value = {
        dictionary: {
          dictionaryId: undefined,
          multiple: undefined
        },
        spec,
        fixValue: props.defaultValueSpec?.fixValue,
        conditionData,
        ...props.data
      }
      return EnumItem;
    case 'String':
    case 'Byte':
    case 'Long':
      formModel.value = {
        defaultValueSpec: undefined,
        validator: {
          provider: undefined,
          configuration: {
            message: '数据格式错误',
            group: ['save', 'update', 'insert'],
          }
        },
        fixValue: props.defaultValueSpec?.fixValue,
        conditionData,
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
        defaultValueSpec: undefined,
        validator: {
          provider: undefined,
          configuration: {
            message: '数据格式错误',
            group: ['save', 'update', 'insert'],
            classType: javaType,
            regexp: undefined,
            min: undefined,
            max: undefined
          }
        },
        spec,
        fixValue: props.defaultValueSpec?.fixValue,
        conditionData,
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
    case 'Boolean':
    case 'DateTime':
      formModel.value = {
        spec,
        ...props.data
      }
      return BooleanItem;
  }
})

const cancel = () => {
  emit('cancel')
}
const save = () => {
  formRef.value.validate().then(res => {
    if (res) {
      const conditionData = formModel.value.conditionData
      const _fixValue = formModel.value.fixValue
      const newData = omit({
        ...props.data,
        ...formModel.value
      }, ['conditionData'])
      console.log(_fixValue, conditionData)
      if (_fixValue) {
        newData.defaultValueSpec = {
          fixValue: _fixValue
        }
      } else if (conditionData) {
        newData.defaultValueSpec = {
          template: {
            parts: [{
              type: 'condition',
              condition: {
                condition: conditionData
              }
            }]
          }
        }
      }

      emit('save', newData)
    }
  })
}

</script>

<style scoped>

</style>
