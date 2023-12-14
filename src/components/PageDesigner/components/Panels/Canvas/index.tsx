import { extractCssClass, insertCustomCssToHead } from "@LowCode/components/PageDesigner/utils/utils"
import DraggableLayout from "../../Draggable/DraggableLayout"
import './index.less'
import {useKeys, useTool} from '../../../hooks'
import { Dropdown, Menu, MenuItem, Button } from 'jetlinks-ui-components'
import {map} from "lodash-es";
import {provide, reactive} from "vue";
import {PageSymbol} from "@LowCode/components/PageDesigner/core/context";

const Canvas = defineComponent({
  name: 'Canvas',
  inheritAttrs: false,
  customOptions: {},
  setup(props, {expose}) {
    const { isEditModel, setSelection, onPaste, paramsUtil, _global } = useTool()
    const designer: any = inject('PageDesigner')
    const cssClassList = ref<string[]>([])
    const canvasRef = ref<any>()
    const { } = useKeys(canvasRef)
    const $refs = reactive({})

    const pageEntity = {
      // context,
      $refs: $refs,
      addRef(key: string, data: any) {
        $refs[key] = data
      },
      removeRef(key: string) {
        delete $refs[key]
      },
    }

    provide(PageSymbol, pageEntity)

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
        let customFn = new Function('refs', 'util', 'global', designer.pageData.value?.componentProps?.mountedCode)
        customFn({}, paramsUtil, _global)
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

    const _error = computed(() => {
      if(unref(isEditModel) && map(designer.errorKey.value, 'key').includes('root')) {
        return '1px solid red'
      }
      return 'none'
    })

    expose({
      $refs: pageEntity?.$refs
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
              style={{
                border: _error.value,
                backgroundImage: `url(${designer.pageData.value?.componentProps?.backgroundImage})`,
                backgroundSize: 'cover',
              }}
          >
            { isEditModel.value ? renderChildren() : renderContent()}
          </div>
      )
    }
  }
})

export default Canvas
