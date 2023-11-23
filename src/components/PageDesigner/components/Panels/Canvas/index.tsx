import { extractCssClass, insertCustomCssToHead } from "@LowCode/components/PageDesigner/utils/utils"
import DraggableLayout from "../../Draggable/DraggableLayout"
import './index.less'
import { useTool } from '../../../hooks'
import { useMagicKeys, useElementHover } from '@vueuse/core'

const Canvas = defineComponent({
  name: 'Canvas',
  inheritAttrs: false,
  customOptions: {},
  setup() {
    const { isEditModel, setSelection, onCopy, onShear, onPaste, onDelete } = useTool()
    const designer: any = inject('PageDesigner')
    const cssClassList = ref<string[]>([])
    const canvasRef = ref<any>()
    const keys = useMagicKeys()
    const focused = useElementHover(canvasRef)

    const handleClick = () => {
      setSelection('root')
    }

    watch(
      () => [keys?.['Ctrl']?.value, keys?.['Meta']?.value],
      ([v1, v2]) => {
        // designer._ctrl.value = v1 || v2
      },
    )

    watch(
      () => [keys?.['Ctrl+C']?.value, keys?.['Meta+C']?.value],
      ([v1, v2]) => {
        // designer._other.value = v1 || v2
        if ((v1 || v2) && isEditModel?.value && designer?.focus?.value) {
          onCopy?.()
        }
      },
    )

    watch(
      () => [keys?.['Ctrl+X']?.value, keys?.['Meta+X']?.value],
      ([v1, v2]) => {
        // designer._other.value = v1 || v2
        if ((v1 || v2) && isEditModel?.value && designer?.focus?.value) {
          onShear?.()
        }
      },
    )

    watch(
      () => [keys?.['Ctrl+V']?.value, keys?.['Meta+V']?.value],
      ([v1, v2]) => {
        // designer._other.value = v1 || v2
        if ((v1 || v2) && isEditModel?.value && designer?.focus?.value) {
          onPaste?.()
        }
      },
    )

    // 删除
    watch(
      () => [keys?.['Backspace']?.value, keys?.['Delete']?.value],
      ([v1, v2]) => {
        // designer._other.value = v1 || v2
        if ((v1 || v2) && isEditModel.value && designer.focus?.value) {
          if (!designer?.delVisible?.value) {
            onDelete?.()
          }
        }
      },
    )

    watch(
      () => focused?.value,
      (newValue) => {
        if (designer.focus) {
          designer.focus.value = newValue
        }
      },
      {
        immediate: true,
        deep: true
      }
    )

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
          ref={canvasRef}
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
