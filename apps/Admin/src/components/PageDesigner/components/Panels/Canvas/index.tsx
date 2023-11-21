import DraggableLayout from "../../Draggable/DraggableLayout"
import './index.less'

const Canvas = defineComponent({
  name: 'Canvas',
  inheritAttrs: false,
  customOptions: {},
  setup() {
    const designer: any = inject('FormDesigner')

    const isEditModel = computed(() => {
      return unref(designer?.model) === 'edit'
    })

    const handleClick = () => {
      designer.setSelection('root')
    }

    return () => {
      return (
        <div class="subject"
          onClick={() => {
            if (unref(isEditModel)) {
              handleClick()
            }
          }}
        >
          <DraggableLayout
            data-layout-type={'root'}
            style={{
              height: '100%',
              width: '100%',
            }}
            data={designer.pageData.value?.children || []}
            parent={designer.pageData.value}
            isRoot
          ></DraggableLayout>
        </div>
      )
    }
  }
})

export default Canvas
