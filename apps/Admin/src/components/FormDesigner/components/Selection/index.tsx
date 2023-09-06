import { isHTMLTag } from '@vue/shared'
import { withModifiers } from 'vue'
import './index.less'
import { AIcon, Dropdown, Menu, MenuItem, Button, Modal } from 'jetlinks-ui-components'
import { checkIsField, extractCssClass, insertCustomCssToHead } from '../../utils/utils'
import { cloneDeep, set } from 'lodash-es'
import { useFormDesigner } from '@/store/designer'
import { addContext } from '../../utils/addContext'

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
  setup(props, { slots, expose }) {
    const designer: any = inject('FormDesigner')
    const isField = checkIsField(props.data)
    const cssClassList = ref<string[]>([])
    const visible = ref<boolean>(true)

    const formDesigner = useFormDesigner()

    const Selected = computed(() => {
      const flag = designer.selected.value.find(item => props?.data?.key === item.key)
      return props?.data?.key !== undefined && flag
    })

    const isMultiple = computed(() => {
      return designer.selected.value?.length > 1
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
          Modal.confirm({
            title: '确定删除组件及其配置？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
              if (!props.data?.context) {
                addContext(props.data, props.parent)
              }
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
            },
          });
          break
        case 'copy':
          if (!props.data?.context) {
            addContext(props.data, props.parent)
          }
          props.data.context?.copy()
          const copyData = props.parent?.[index + 1]
          designer.setSelection(copyData)
          break
        default: break
      }
    }
    const TagComponent = isHTMLTag(props.tag as string) ? props.tag : resolveComponent(props.tag as string)

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

    // 复制
    const onCopy = () => {
      formDesigner.setCopyData(designer.selected.value || [])
    }
    // 粘贴
    const onPaste = () => {
      const _data = formDesigner.getCopyData()
      if (_data.length) {
        _data.map(item => {
          const index = (props?.parent || [])?.findIndex(item => item?.key === props.data?.key)
          props.data.context?.paste(item)
          const copyData = props.parent?.[index + 1]
          designer.setSelection(copyData)
        })
        formDesigner.deleteData()
      }
    }
    // 剪切
    const onShear = () => {
      formDesigner.setCopyData(designer.selected.value || [])
      handleAction('remove')
    }
    // 删除
    const onDelete = () => {
      console.log(designer.selected.value)
      handleAction('remove')
    }

    // 收藏为模板
    const onCollect = () => {
      designer.collectData.value = designer.selected.value || []
      designer.collectVisible.value = true
    }

    expose({ setVisible, setOptions, setValue, setDisabled })

    const maskNode = () => {
      return <Dropdown
        trigger={['contextmenu']}
        onContextmenu={withModifiers(() => { }, ['stop'])}
        v-slots={{
          overlay: () => {
            return (
              <Menu>
                <MenuItem key="copy"><Button type="link" onClick={onCopy}>复制</Button></MenuItem>
                <MenuItem key="paste"><Button type="link" onClick={onPaste}>粘贴</Button></MenuItem>
                <MenuItem key="shear"><Button type="link" onClick={onShear}>剪切</Button></MenuItem>
                <MenuItem key="delete"><Button danger type="link" onClick={onDelete}>删除</Button></MenuItem>
                <MenuItem key="collect"><Button type="link" onClick={onCollect}>收藏为模版</Button></MenuItem>
              </Menu>
            )
          }
        }}
      >
        <div class={['mask']}></div>
      </Dropdown>
    }

    const renderSelected = () => {
      return <TagComponent
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
        {
          unref(isEditModel) && Selected.value && !isMultiple.value && (
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
        {unref(isEditModel) && props.hasMask && maskNode()}
      </TagComponent>
    }

    return () => renderSelected()
  }
})

export default Selection
