<template>
  <j-modal
    visible
    title="配置"
    @cancel="cancel"
    @ok="save"
  >
    <j-form
      ref="formRef"
      :model="formModel"
      layout="vertical"
    >
<!--      <component :is="componentName" :form="formRef" />-->
      <NumberItem v-if="visible === 'number'" />
    </j-form>
  </j-modal>
</template>

<script setup lang="jsx" name="typeModal">
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
  }
})

const emit = defineEmits(['cancel', 'save'])

const formRef = ref()
const formModel = ref({})
const visible = ref('')

provide(SETTING_FORM_MODEL, formModel)
provide(SETTING_FORM_REF, formRef)

const componentName = computed(() => {
  const { javaType, ...setting } = props.data

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
        ...setting
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
            message: undefined,
            group: undefined
          }
        },
        spec,
        ...setting
      }
      return StringItem;
    case 'Double':
    case 'Int':
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
            message: undefined,
            group: undefined,
            classType: javaType,
            regexp: undefined
          }
        },
        spec,
        ...setting
      }
      visible.value = 'number'
      return NumberItem;
    case 'List':
      formModel.value = {
        defaultValueSpec: {
          fixValue: undefined
        },
        spec,
        ...setting
      }
      return ListItem;
    case 'Map':

      formModel.value = {
        others: {

        },
        spec,
        ...setting
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

const handleComponents = () => {
  const { javaType, ...setting } = props.data

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
        ...setting
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
            message: undefined,
            group: undefined
          }
        },
        spec,
        ...setting
      }
      return StringItem;
    case 'Double':
    case 'Int':
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
            message: undefined,
            group: undefined,
            classType: javaType,
            regexp: undefined
          }
        },
        spec,
        ...setting
      }
      visible.value = 'number'
      return NumberItem;
    case 'List':
      formModel.value = {
        defaultValueSpec: {
          fixValue: undefined
        },
        spec,
        ...setting
      }
      return ListItem;
    case 'Map':

      formModel.value = {
        others: {

        },
        spec,
        ...setting
      }
      return MapItem;
  }
}

watch(() => props.data.javaType, () =>{
  handleComponents()
}, { immediate: true })

</script>

<style scoped>

</style>
