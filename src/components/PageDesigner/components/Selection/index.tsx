import { isHTMLTag } from '@vue/shared'
import { withModifiers } from 'vue'
import './index.less'
import { AIcon, Dropdown, Menu, MenuItem, Button } from 'jetlinks-ui-components'
import { useTool } from '../../hooks'
import { extractCssClass, insertCustomCssToHead } from '../../utils/utils'
import {map} from "lodash-es";

const Selection = defineComponent({
  name: 'Selection',
  inheritAttrs: false,
  customOptions: {},
  props: {
    data: {
      type: Object,
      default: () => ({ })
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
  },
  setup(props, { slots }) {
    const cssClassList = ref<string[]>([])
    const designer: any = inject('PageDesigner')
    const { _noCopyData, isEditModel, onPaste, onDelete, setSelection, onCopy, onShear } = useTool()

    const Selected = computed(() => {
      if (unref(isEditModel)) {
        const flag = designer.selected.value.find((item: any) => props?.data?.key === item.key)
        return props?.data?.key !== undefined && flag
      }
      return false
    })

    const _error = computed(() => {
      const arr = map(designer.errorKey?.value, 'key')
      return unref(isEditModel) && arr.includes(props.data?.key)
    })

    const handleClick = () => {
      if (unref(isEditModel)) {
        setSelection(props.data)
      }
    }

    const TagComponent = isHTMLTag(props.tag as string) ? props.tag : resolveComponent(props.tag as string)

    const _hasDrag = computed(() => { return props.hasDrag && unref(isEditModel) })

    watchEffect(() => {
      const arr = extractCssClass(props.data?.componentProps?.cssCode)
      cssClassList.value = arr
      insertCustomCssToHead(props.data?.componentProps?.cssCode, props.data?.key)
    })

    onMounted(() => {
      if(!unref(isEditModel) && props.data?.componentProps?.mountedCode){
        // TODO: 参数问题需要解决
        let customFn = new Function(props.data?.componentProps?.mountedCode)
        customFn()
      }
    })

    const editNode = () => {
      return <Dropdown
        trigger={['contextmenu']}
        onContextmenu={withModifiers(() => {
          const flag = designer.selected.value.find((item: any) => item.key === props.data.key)
          if (!flag) {
            setSelection(props.data)
          }
        }, ['stop'])}
        v-slots={{
          overlay: () => {
            const flag = !_noCopyData.includes(props.data.type)
            return (
              <Menu>
                {
                  flag && <>
                      <MenuItem key="copy"><Button type="link" onClick={() => {
                        onCopy(designer.data?.id)
                      }}>复制</Button></MenuItem>
                      <MenuItem key="paste"><Button type="link" onClick={() => {
                        onPaste(designer.data?.id)
                      }}>粘贴</Button></MenuItem>
                      <MenuItem key="shear"><Button type="link" onClick={() => {
                        onShear(designer.data?.id)
                      }}>剪切</Button></MenuItem>
                    </>
                }
                <MenuItem key="delete"><Button danger type="link" onClick={() => {
                  onDelete()
                }}>删除</Button></MenuItem>
              </Menu>
            )
          }
        }}
      >
        <div style={{ position: 'relative' }}>
          {slots?.default()}
          {props.hasMask && <div class={['mask']}></div>}
        </div>
      </Dropdown>
    }

    return () => {
      return (
        <TagComponent
          data-id={props.data?.key}
          class={[
            'selectElement',
            unref(_hasDrag) && 'handle',
            unref(Selected) && 'Selected',
            unref(isEditModel) && 'edit-hover',
            unref(_error) && 'Warning',
            ...unref(cssClassList)
          ]}
          {...useAttrs()}
          onClick={withModifiers(handleClick, ['stop'])}

        >
          {unref(isEditModel) ? editNode() : slots?.default()}
          {
            unref(isEditModel) && Selected.value && (
              <div class="bottomRight">
                {
                  props.hasCopy && (
                    <div
                      class="action"
                      onClick={withModifiers(() => {
                        onPaste(designer.data?.id)
                      }, ['stop'])}
                    >
                      <AIcon type="CopyOutlined" />
                    </div>
                  )
                }
                {
                  props.hasDel && (
                    <div
                      class="action"
                      onClick={withModifiers(() => { onDelete() }, ['stop'])}
                    >
                      <AIcon type="DeleteOutlined" />
                    </div>
                  )
                }
              </div>
            )
          }
        </TagComponent>
      )
    }
  }
})

export default Selection
