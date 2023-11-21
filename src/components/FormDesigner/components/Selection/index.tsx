import { isHTMLTag } from '@vue/shared'
import { withModifiers } from 'vue'
import './index.less'
import { AIcon, Dropdown, Menu, MenuItem, Button } from 'jetlinks-ui-components'
import { checkIsField, copyDataByKey, extractCssClass, findParentById, handleCopyData, insertCustomCssToHead, updateData } from '../../utils/utils'
import { map, set, cloneDeep } from 'lodash-es'
import { uid } from '../../utils/uid'

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
      if (props?.data?.type === 'table-item') {
        return arr.includes(props.data?.children?.[0]?.key)
      } else {
        return arr.includes(props.data?.key)
      }
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
      const obj = {
        ...props.data,
        componentProps: props.data.type === 'tree-select' ? {
          ...props.data.componentProps,
          options: arr
        } : {
          ...props.data.componentProps,
          treeData: arr
        }
      }
      const _list = updateData(unref(designer.formData)?.children, obj)
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
      const _data: any = {
        ...cloneDeep(props.data),
        key: props.data?.key + '_' + uid(),
        children: handleCopyData(props.data?.children || []),
      }
      if (!['grid-item'].includes(props.data?.type)) {
        _data.formItemProps = {
          ...props.data?.formItemProps,
          label: 'copy_' + props.data?.formItemProps?.label,
          name: 'copy_' + props.data?.formItemProps?.name
        }
      }
      const dt = findParentById(designer.formData.value, props.data)
      if (dt?.key === 'root') {
        designer.formData.value = {
          ...designer.formData.value,
          children: [...designer.formData.value?.children, _data],
        }
      } else {
        designer.formData.value = {
          ...designer.formData.value,
          children: copyDataByKey(designer.formData.value?.children, [_data], props.data),
        }
      }
      designer.setSelection(_data || 'root')
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

    const editNode = () => {
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
                <MenuItem key="copy"><Button type="link" onClick={() => { designer.onCopy() }}>复制</Button></MenuItem>
                <MenuItem key="paste"><Button type="link" onClick={onPaste}>粘贴</Button></MenuItem>
                <MenuItem key="shear"><Button type="link" onClick={onShear}>剪切</Button></MenuItem>
                <MenuItem key="delete"><Button danger type="link" onClick={onDelete}>删除</Button></MenuItem>
                {designer?.type === 'low-code' && <MenuItem key="collect"><Button type="link" onClick={onCollect}>收藏为模版</Button></MenuItem>}
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

    const isInline = computed(() => {
      return designer.formData?.value?.componentProps?.layout === 'inline'
    })

    const renderSelected = () => {
      return <TagComponent
        data-id={props.data?.key}
        class={[
          'selectElement',
          unref(isInline) && 'inlineElement',
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
        {unref(isEditModel) ? editNode() : slots?.default()}
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
      </TagComponent>
    }

    return () => renderSelected()
  }
})

export default Selection