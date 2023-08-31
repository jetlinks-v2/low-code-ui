import { isHTMLTag } from '@vue/shared'
import { withModifiers } from 'vue'
import './index.less'
import { AIcon } from 'jetlinks-ui-components'
import { checkIsField, extractCssClass, insertCustomCssToHead } from '../../utils/utils'
import { cloneDeep, set } from 'lodash-es'
import ContextMenu from '../ContextMenu/index.vue'

const Selection = defineComponent({
  name: 'Selection',
  inheritAttrs: false,
  customOptions: {},
  props: {
    data: {
      type: Object,
      default: () => { }
    },
    tag: {
      type: String,
      default: 'div'
    },
    parent: {
      type: [Array, Object],
      default: () => []
    },
    hasMask: {
      type: Boolean,
      default: false
    },
    hasDrag: {
      type: Boolean,
      default: true
    },
    hasDel: {
      type: Boolean,
      default: false
    },
    hasCopy: {
      type: Boolean,
      default: false
    },
    path: {
      type: Array,
      default: () => []
    },
  },
  setup(props, { expose }) {
    const designer: any = inject('FormDesigner')
    const slots = useSlots()
    const isField = checkIsField(props.data)
    const cssClassList = ref<string[]>([])
    const visible = ref<boolean>(true)

    const Selected = computed(() => {
      return props?.data?.key !== undefined && designer.selected?.key === props?.data?.key
    })

    const isEditModel = computed(() => {
      return unref(designer?.model) === 'edit'
    })

    const handleClick = () => {
      if (unref(isEditModel)) {
        designer.setSelection(props.data)
      }
    }

    const handleAction = (_type: string) => {
      const index = (props?.parent || [])?.findIndex(item => item?.key === props.data?.key)
      switch (_type) {
        case 'remove':
          props.data.context?.delete()
          const arr: any = cloneDeep(props.parent) || []
          if (arr?.length > 0) {
            if (index === arr?.length) {
              designer.setSelection(arr?.[index - 1])
            } else {
              designer.setSelection(arr?.[index])
            }
          } else {
            designer.setSelection('root')
          }
          break
        case 'copy':
          props.data.context?.copy()
          const copyData = props.parent?.[index + 1]
          designer.setSelection(copyData)
          break
        default: break
      }
    }
    const TagComponent = isHTMLTag(props?.tag) ? props.tag : resolveComponent(props?.tag)

    const maskNode = (<div class={['mask']}></div>)

    const _hasDrag = computed(() => { return props.hasDrag })

    const _error = computed(() => {
      return designer.errorKey?.value.includes(props.data?.key)
    })

    watchEffect(() => {
      const arr = extractCssClass(props.data.componentProps?.cssCode)
      cssClassList.value = arr
      insertCustomCssToHead(props.data.componentProps?.cssCode, props.data?.key)
    })

    const setVisible = (bool: boolean) => {
      visible.value = bool
    }

    const setOptions = (arr: any[]) => {
      props.data.context?.updateProps(arr, 'options')
    }

    const setValue = (_val: any) => {
      if (Array.isArray(props.path) && props.path?.length) {
        set(designer.formState, props.path, _val)
      }
    }

    const setDisabled = (bool: boolean) => {
      props.data.context?.updateProps(bool, 'disabled')
    }

    expose({ setVisible, setOptions, setValue, setDisabled })

    return () => {
      return visible.value ? (
        // <ContextMenu>
          <TagComponent
            class={[
              'selectElement',
              unref(isEditModel) && unref(_hasDrag) && 'handle',
              !isField && 'borderless',
              unref(isEditModel) && Selected.value && 'Selected',
              unref(isEditModel) && 'edit-hover',
              unref(isEditModel) && unref(_error) && 'Warning',
              ...unref(cssClassList)
            ]}
            {...useAttrs()}
            onClick={withModifiers(handleClick, ['stop'])}
          >
            {slots?.default()}
            {/* {
            // 拖拽按钮
            unref(isEditModel) && Selected.value && unref(_hasDrag) && (
              <div class={['topLeft']}>
                <AIcon
                  class={['handle', 'dragIcon']}
                  type="CompressOutlined"
                />
              </div>
            )
          } */}
            {
              unref(isEditModel) && Selected.value && (
                <div class="bottomRight">
                  {
                    props.hasCopy && (
                      <div
                        class="action"
                        onClick={withModifiers(() => { handleAction('copy') }, ['stop'])}
                      >
                        <AIcon type="CopyOutlined" />
                      </div>
                    )
                  }
                  {
                    props.hasDel && (
                      <div
                        class="action"
                        onClick={withModifiers(() => { handleAction('remove') }, ['stop'])}
                      >
                        <AIcon type="DeleteOutlined" />
                      </div>
                    )
                  }
                </div>
              )
            }
            {
              unref(isEditModel) && props.hasMask && maskNode
            }
          </TagComponent>
        // </ContextMenu>
      ) : <></>
    }
  }
})

export default Selection
