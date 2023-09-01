import { useProps } from "@/components/FormDesigner/hooks"
import { Form, Scrollbar, Dropdown, Menu, MenuItem, Button } from 'jetlinks-ui-components'
import DraggableLayout from "../../Draggable/DraggableLayout"
import './index.less'
import { cloneDeep, omit } from "lodash-es"
import { addContext } from "@/components/FormDesigner/utils/addContext"
import { uid } from "@/components/FormDesigner/utils/uid"
import CollectModal from '../../CollectModal/index.vue'
import { useProduct, useFormDesigner } from "@/store"

export default defineComponent({
  name: 'Canvas',
  inheritAttrs: false,
  customOptions: {},
  setup() {
    const designer: any = inject('FormDesigner')
    const formDesigner = useFormDesigner()
    const product = useProduct()

    const handleClick = () => {
      designer.setSelection('root')
    }

    const isEditModel = computed(() => {
      return unref(designer?.model) === 'edit'
    })

    const _style = {
      margin: '10px 10px 0 10px',
      paddingTop: '10px',
      height: '100%',
      boxSizing: 'border-box'
    }

    const onPaste = () => {
      const _data = formDesigner.getCopyData()
      if (_data) {
        const newNode = reactive(cloneDeep(toRaw(_data)))
        delete newNode.context
        newNode.key = `${newNode.type}_${uid()}-paste`
        addContext(newNode, unref(designer.formData), (node) => {
          node.key = `${node.type}_${uid()}-paste`
        })
        designer.formData?.value?.children?.push(newNode)
        designer.setSelection(newNode)
        formDesigner.deleteData()
      }
    }

    const renderContent = () => {
      const typeProps = useProps(designer, true) // 根结点，也是form的props
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
            {...unref(typeProps)}
          >
            {Layout}
          </Form>
        </div>
      )
    }

    const renderChildren = () => {
      return <Dropdown
        trigger={['contextmenu']}
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
          {unref(isEditModel)
            ? (
              <div class="container">
                <Scrollbar height={'100%'}>
                  <div class="subject">
                    {renderChildren()}
                  </div>
                </Scrollbar>
              </div>
            )
            : renderContent()}
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
