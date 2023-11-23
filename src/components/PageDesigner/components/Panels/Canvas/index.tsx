import { extractCssClass, insertCustomCssToHead } from "@LowCode/components/PageDesigner/utils/utils"
import DraggableLayout from "../../Draggable/DraggableLayout"
import './index.less'
import { PageProvider } from "../../../core";
import { useKeys, useTool } from '../../../hooks'
import { Dropdown, Menu, MenuItem, Button } from 'jetlinks-ui-components'

const Canvas = defineComponent({
  name: 'Canvas',
  inheritAttrs: false,
  customOptions: {},
  setup() {
    const { isEditModel, setSelection, onPaste } = useTool()
    const designer: any = inject('PageDesigner')
    const cssClassList = ref<string[]>([])
    const canvasRef = ref<any>()
    const { } = useKeys(canvasRef)

    const handleClick = () => {
      setSelection('root')
    }

    watchEffect(() => {
      const arr = extractCssClass(unref(designer.pageData)?.componentProps?.cssCode)
      cssClassList.value = arr
      insertCustomCssToHead(unref(designer.pageData)?.componentProps?.cssCode, 'root')
    })

    const _padding = computed(() => {
      return unref(designer.pageData)?.componentProps?.padding || 0
    })

    const renderContent = () => {
      return <DraggableLayout
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
    }

    const renderChildren = () => {
      return <Dropdown
        trigger={['contextmenu']}
        onContextmenu={() => {
          const flag = designer.selected.value.find((item: any) => item.key === 'root')
          if (!flag) {
            setSelection('root')
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
        <PageProvider>
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
            {!!designer.copyData.value?.length ? renderChildren() : renderContent()}
          </div>
        </PageProvider>
      )
    }
  }
})

export default Canvas
