import { useProps, useTarget } from "@/components/FormDesigner/hooks"
import { Form, Scrollbar } from 'jetlinks-ui-components'
import DraggableLayout from "../../Draggable/DraggableLayout"
import './index.less'

export default defineComponent({
  name: 'Canvas',
  inheritAttrs: false,
  customOptions: {},
  setup() {
    const _data: any = inject('FormDesigner')

    const {
      state,
      setSelection,
      isEditModel
    } = useTarget()
    const form = ref('')

    const handleClick = (e) => {
      setSelection('root')
    }

    const renderContent = () => {
      const typeProps = useProps(state, state, true)
      const Layout = (<DraggableLayout data-layout-type={'root'} class={[unref(isEditModel) && 'wrap']} data={state.store} parent={state.store} isRoot></DraggableLayout>)
      return (
        <div>
          <Form ref={form} onClick={unref(isEditModel) && handleClick} {...typeProps.value}>
            { Layout }
          </Form>
          {/* 提交按钮 */}
          {/* {!unref(isEditModel) && !isEmpty(state.config) && ER.props.isShowCompleteButton && <CompleteButton handle={form}/>} */}
        </div>
      )
    }
    return () => {
      return (
        <div
          class={['canvas-box' , isEditModel.value && 'editModel']}>
          {unref(isEditModel)
            ? (
              <div class="container">
                <Scrollbar ref={_data.canvasScrollRef}>
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
