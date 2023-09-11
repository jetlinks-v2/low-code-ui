import { Form, Scrollbar, Dropdown, Menu, MenuItem, Button } from 'jetlinks-ui-components'
import DraggableLayout from "../../Draggable/DraggableLayout"
import './index.less'
import { cloneDeep, omit } from "lodash-es"
import { uid } from "@/components/FormDesigner/utils/uid"
import CollectModal from '../../CollectModal/index.vue'
import { useProduct } from "@/store"
import { extractCssClass, insertCustomCssToHead } from "@/components/FormDesigner/utils/utils"
import { useMagicKeys } from '@vueuse/core'

const Canvas = defineComponent({
  name: 'Canvas',
  inheritAttrs: false,
  customOptions: {},
  setup() {
    const designer: any = inject('FormDesigner')
    const product = useProduct()

    const keys = useMagicKeys()

    const cssClassList = ref<string[]>([])

    const handleClick = () => {
      designer.setSelection('root')
    }

    const isEditModel = computed(() => {
      return unref(designer?.model) === 'edit'
    })

    watch( // keys['Ctrl']?.value, keys['Meta']?.value, 
      () => keys['Shift']?.value,
      (v1) => {
        designer._ctrl.value = v1
      },
    )

    watch(
      () => [keys['Ctrl+C']?.value, keys['Meta+C']?.value],
      ([v1, v2]) => {
        if ((v1 || v2) && isEditModel.value) {
          designer.onCopy()
        }
      },
    )

    watch(
      () => [keys['Ctrl+X']?.value, keys['Meta+X']?.value],
      ([v1, v2]) => {
        if ((v1 || v2) && isEditModel.value) {
          designer.onShear()
        }
      },
    )

    watch(
      () => [keys['Ctrl+V']?.value, keys['Meta+V']?.value],
      ([v1, v2]) => {
        if ((v1 || v2) && isEditModel.value) {
          designer.onPaste()
        }
      },
    )

    // 删除
    watch(
      () => [keys['Backspace'].value, keys['Delete'].value],
      ([v1, v2]) => {
        if ((v1 || v2) && isEditModel.value && !designer.focus) {
          if (!designer.delVisible.value) {
            designer.onDelete()
          }
        }
      },
    )

    const getWidgetRef = (path) => {
      let foundRef = unref(designer.refList)?.[path]
      return foundRef
    }

    const _style = {
      margin: '10px 10px 0 10px',
      paddingTop: '10px',
      height: '100%',
      boxSizing: 'border-box'
    }

    const onPaste = () => {
      designer.onPaste()
    }

    watchEffect(() => {
      const arr = extractCssClass(unref(designer.formData)?.componentProps?.cssCode)
      cssClassList.value = arr
      insertCustomCssToHead(unref(designer.formData)?.componentProps?.cssCode, 'root')
    })

    const renderContent = () => {

      const Layout = (
        <DraggableLayout
          path={[]}
          index={0}
          data-layout-type={'root'}
          style={_style}
          data={unref(designer.formData)?.children}
          parent={unref(designer.formData)}
          isRoot
        ></DraggableLayout>
      )

      return (
        <div style={{ height: '100%' }}>
          <Form
            ref={designer.formRef}
            model={designer.formState}
            {...omit(unref(designer.formData)?.componentProps, ['size'])}
            onClick={unref(isEditModel) && handleClick}
            class={[...unref(cssClassList)]}
            onValidate={(name, status, errorMsgs) => {
              if (unref(designer.formData)?.componentProps?.eventCode) {
                let customFn = new Function('e', unref(designer.formData)?.componentProps?.eventCode)
                customFn.call({ getWidgetRef: getWidgetRef }, name, status, errorMsgs)
              }
            }}
          >
            {Layout}
          </Form>
        </div>
      )
    }

    const renderChildren = () => {
      return <Dropdown
        trigger={['contextmenu']}
        onContextmenu={() => {
          const flag = designer.selected.value.find(item => item.key === 'root')
          if (!flag) {
            designer.setSelection('root')
          }
        }}
        v-slots={{
          overlay: () => {
            return (
              <Menu>
                <MenuItem key="paste"><Button type="link" onClick={onPaste}>粘贴</Button></MenuItem>
              </Menu>
            )
          }
        }}
      >
        {renderContent()}
      </Dropdown>
    }

    return () => {
      return (
        <div class={['canvas-box', unref(isEditModel) && 'editModel']}>
          <div class="container">
            <Scrollbar height={'100%'}>
              <div class="subject">
                {unref(isEditModel) ? renderChildren() : renderContent()}
              </div>
            </Scrollbar>
          </div>
          {unref(designer.collectVisible) && unref(isEditModel) && <CollectModal
            onSave={(name: string) => {
              const obj = {
                key: uid(8),
                name: name,
                template: cloneDeep(unref(designer.collectData))
              }
              // 保存为模板
              const arr = product.data?.[0]?.others?.formTemplate || []
              const _data = {
                ...product.data?.[0],
                others: {
                  ...product.data?.[0]?.others,
                  formTemplate: [...arr, obj]
                }
              }
              product.update(_data)
              designer.collectData.value = undefined
              designer.collectVisible.value = false
            }}
            onClose={() => { designer.collectVisible.value = false }}
          />}
        </div>
      )
    }
  }
})

export default Canvas
