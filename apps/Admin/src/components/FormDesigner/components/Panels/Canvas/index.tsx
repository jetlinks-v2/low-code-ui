import { useProps } from "@/components/FormDesigner/hooks"
import { Form, Scrollbar, Button } from 'jetlinks-ui-components'
import DraggableLayout from "../../Draggable/DraggableLayout"
import './index.less'

export default defineComponent({
  name: 'Canvas',
  inheritAttrs: false,
  customOptions: {},
  setup() {
    const designer: any = inject('FormDesigner')
    const form = ref('')

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
      const typeProps = useProps(designer, true) // 根结点，也是form的props // unref(isEditModel) &&
      const Layout = (<DraggableLayout data-layout-type={'root'} style={[ _style]} data={unref(designer.formData)?.children} parent={unref(designer.formData)} isRoot></DraggableLayout>)
      return (
        <div style={{ height: '100%' }}>
          <Form ref={form} { ...unref(designer.formData)?.componentProps } onClick={unref(isEditModel) && handleClick} {...unref(typeProps)}>
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
