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

    const renderContent = () => {
      return <DraggableLayout
        data-layout-type={'root'}
        style={{
          height: '100%',
          width: '100%'
        }}
        data={designer.pageData.value?.children || []}
        parent={designer.pageData.value}
        isRoot
      ></DraggableLayout>
    }

    onMounted(() => {
      if(!unref(isEditModel) && designer.pageData.value?.componentProps?.mountedCode){
        // TODO: 参数问题需要解决
        let customFn = new Function(designer.pageData.value?.componentProps?.mountedCode)
        customFn.call()
      }
    })

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
            style={{
              backgroundImage: `url(${designer.pageData.value?.componentProps?.backgroundImage})`,
              backgroundSize: 'cover'
            }}
          >
            {!!designer.copyData.value?.length ? renderChildren() : renderContent()}
          </div>
        </PageProvider>
      )
    }
  }
})

export default Canvas
