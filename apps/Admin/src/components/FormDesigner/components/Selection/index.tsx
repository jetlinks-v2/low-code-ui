import { isHTMLTag } from '@vue/shared'
import { withModifiers } from 'vue'
import './index.less'
import { AIcon, Dropdown, Menu, MenuItem, Button } from 'jetlinks-ui-components'
import { checkIsField, extractCssClass, insertCustomCssToHead, updateData } from '../../utils/utils'
import { map, set } from 'lodash-es'

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

    const TagComponent = isHTMLTag(props.tag as string) ? props.tag : resolveComponent(props.tag as string)

    const _hasDrag = computed(() => { return props.hasDrag })

    const _error = computed(() => {
      const arr = map(designer.errorKey?.value, 'key')
      return arr.includes(props.data?.key)
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
      const _list = updateData(unref(designer.formData)?.children, {
        ...props.data,
        componentProps: {
          ...props.data.componentProps,
          options: arr
        }
      })
      designer.formData.value = {
        ...designer.formData.value,
        children: _list || [],
      }
      designer.setSelection(props.data || 'root')
    }

    const setValue = (_val: any) => {
      if (Array.isArray(props.path) && props.path?.length) {
        set(designer.formState, props.path, _val)
      }
    }

    const setDisabled = (bool: boolean) => {
      const _list = updateData(unref(designer.formData)?.children, {
        ...props.data,
        componentProps: {
          ...props.data.componentProps,
          disabled: bool
        }
      })
      designer.formData.value = {
        ...designer.formData.value,
        children: _list || [],
      }
      designer.setSelection(props.data || 'root')
    }

    // 复制
    const onCopy = () => {
      designer.onCopy()
    }
    // 粘贴
    const onPaste = () => {
      designer.onPaste()
    }
    // 剪切
    const onShear = () => {
      designer.onShear()
    }
    // 删除
    const onDelete = () => {
      designer.onDelete()
    }

    // 收藏为模板
    const onCollect = () => {
      designer.onCollect()
    }

    expose({ setVisible, setOptions, setValue, setDisabled })

    const maskNode = () => {
      return <Dropdown
        trigger={['contextmenu']}
        onContextmenu={withModifiers(() => {
          const flag = designer.selected.value.find(item => item.key === props.data.key)
          if (!flag) {
            designer.setSelection(props.data)
          }
        }, ['stop'])}
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
        data-id={props.data?.key}
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
                    onClick={withModifiers(() => onCopy(), ['stop'])}
                  >
                    <AIcon type="CopyOutlined" />
                  </div>
                )
              }
              {
                props.hasDel && (
                  <div
                    class="action"
                    onClick={withModifiers(() => onDelete(), ['stop'])}
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
