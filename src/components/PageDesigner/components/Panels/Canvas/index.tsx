import { extractCssClass, insertCustomCssToHead } from "@LowCode/components/PageDesigner/utils/utils"
import DraggableLayout from "../../Draggable/DraggableLayout"
import './index.less'

const Canvas = defineComponent({
  name: 'Canvas',
  inheritAttrs: false,
  customOptions: {},
  setup() {
    const designer: any = inject('FormDesigner')
    const cssClassList = ref<string[]>([])

    const isEditModel = computed(() => {
      return unref(designer?.model) === 'edit'
    })

    const handleClick = () => {
      designer.setSelection('root')
    }

    watchEffect(() => {
      const arr = extractCssClass(unref(designer.pageData)?.componentProps?.cssCode)
      cssClassList.value = arr
      insertCustomCssToHead(unref(designer.pageData)?.componentProps?.cssCode, 'root')
    })

    const _padding = computed(() => {
      return unref(designer.pageData)?.componentProps?.padding || 0
    })

    return () => {
      return (
        <div
          onClick={() => {
            if (unref(isEditModel)) {
              handleClick()
            }
          }}
          data-id="root"
          class={['subject', ...unref(cssClassList)]}
        >
          <DraggableLayout
            data-layout-type={'root'}
            style={{
              height: '100%',
              width: '100%',
              padding: `0 ${_padding.value}px`
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
