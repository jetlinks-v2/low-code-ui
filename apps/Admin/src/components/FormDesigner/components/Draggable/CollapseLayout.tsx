
import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import { Collapse, CollapsePanel } from 'jetlinks-ui-components'
import './index.less'
import { withModifiers } from 'vue'

export default defineComponent({
  name: 'CollapseLayout',
  inheritAttrs: false,
  customOptions: {},
  props: {
    data: {
      type: Object,
      default: () => { }
    },
    parent: {
      type: Array,
      default: () => []
    },
  },
  setup(props) {
    const designer: any = inject('FormDesigner')

    const list = computed(() => {
      return props.data?.children || []
    })

    const handleAdd = () => {
      props.data.context?.appendItem()
      const addData = unref(list).slice(-1)
      designer?.setSelection(addData)
    }

    const isEditModel = computed(() => {
      return unref(designer?.model) === 'edit'
    })

    return () => {
      return (
        <Selection {...useAttrs()} style={{ padding: '16px' }} hasCopy={true} hasDel={true} hasDrag={true} data={props.data} parent={props.parent}>
          {
            unref(list).length ?
              <Collapse data-layout-type={'collapse'} {...props.data.componentProps}>
                {
                  unref(list).map((element) => {
                    return (
                      <CollapsePanel key={element.key} {...element.componentProps}>
                        <Selection
                          class={'drag-area'}
                          hasDel={true}
                          data={element}
                          tag="div"
                          hasCopy={true}
                          parent={unref(list)}
                        >
                          <DraggableLayout
                            data={element.children}
                            data-layout-type={'item'}
                            parent={element} />
                        </Selection>
                      </CollapsePanel>
                    )
                  })
                }
              </Collapse> :
              (unref(isEditModel) ? <div class="draggable-empty">折叠面板</div> : <div></div>)
          }
          {
            unref(isEditModel) &&
            <div class="draggable-add">
              <div class="draggable-add-btn" onClick={withModifiers(handleAdd, ['stop'])}>添加面板</div>
            </div>
          }
        </Selection>
      )
    }
  }
})
