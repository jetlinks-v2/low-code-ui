import { useProps } from "@/components/FormDesigner/hooks"
import { Form, Scrollbar } from 'jetlinks-ui-components'
import DraggableLayout from "../../Draggable/DraggableLayout"
import './index.less'
import { cloneDeep, omit } from "lodash-es"

export default defineComponent({
  name: 'Canvas',
  inheritAttrs: false,
  customOptions: {},
  setup() {
    const designer: any = inject('FormDesigner')

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

    const renderContent = () => {
      const typeProps = useProps(designer, true) // 根结点，也是form的props
      const arr: any[] = []
      const Layout = (<DraggableLayout path={cloneDeep(arr)} index={0} data-layout-type={'root'} style={[_style]} data={unref(designer.formData)?.children} parent={unref(designer.formData)} isRoot></DraggableLayout>)

      return (
        <div style={{ height: '100%' }}>
          <Form
            ref={designer.formRef}
            model={designer.formState}
            {...omit(unref(designer.formData)?.componentProps, ['size', 'children'])}
            onClick={unref(isEditModel) && handleClick}
            {...unref(typeProps)}
          >
            {Layout}
          </Form>
        </div>
      )
    }

    return () => {
      return (
        <div class={['canvas-box', unref(isEditModel) && 'editModel']}>
          {unref(isEditModel)
            ? (
              <div class="container">
                <Scrollbar height={'100%'}>
                  <div class="subject">
                    {renderContent()}
                  </div>
                </Scrollbar>
              </div>
            )
            : renderContent()}
        </div>
      )
    }
  }
})
