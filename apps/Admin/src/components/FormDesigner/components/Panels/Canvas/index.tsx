import { useProps } from "@/components/FormDesigner/hooks"
import { Form, Scrollbar } from 'jetlinks-ui-components'
import DraggableLayout from "../../Draggable/DraggableLayout"
import './index.less'
import { useFormDesignerStore } from "@/store"

export default defineComponent({
  name: 'Canvas',
  inheritAttrs: false,
  customOptions: {},
  setup() {
    const designer = useFormDesignerStore()
    const form = ref('')

    const handleClick = () => {
      designer.setSelection('root')
    }

    const isEditModel = computed(() => {
      return designer.model === 'edit'
    })

    const _style = {
      margin: '10px 10px 0 10px',
      paddingTop: '10px',
      height: '800px',
      boxSizing: 'border-box'
    }

    const renderContent = () => {
      const typeProps = useProps(designer, true) // 根结点，也是form的props // unref(isEditModel) &&
      const Layout = (<DraggableLayout data-layout-type={'root'} style={[ _style]} data={designer.formData.children} parent={designer.formData} isRoot></DraggableLayout>)
      return (
        <div>
          <Form ref={form} { ...designer.formData.componentProps } onClick={unref(isEditModel) && handleClick} {...unref(typeProps)}>
            {Layout}
          </Form>
          {/* 提交按钮 */}
          {/* {!unref(isEditModel) && !isEmpty(state.config) && ER.props.isShowCompleteButton && <CompleteButton handle={form}/>} */}
        </div>
      )
    }
    return () => {
      return (
        <div class={['canvas-box', unref(isEditModel) && 'editModel']}>
          {unref(isEditModel)
            ? (
              <div class="container">
                <Scrollbar>
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
