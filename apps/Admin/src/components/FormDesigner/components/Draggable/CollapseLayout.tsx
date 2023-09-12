
import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import { Collapse, CollapsePanel, FormItem } from 'jetlinks-ui-components'
import './index.less'
import { withModifiers } from 'vue'
import { cloneDeep } from 'lodash-es'
import { addContext } from '../../utils/addContext'

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
    path: {
      type: Array,
      default: () => []
    },
    index: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const designer: any = inject('FormDesigner')

    const list = computed(() => {
      return props.data?.children || []
    })

    const handleAdd = () => {
      if (!props.data?.context) {
        addContext(props.data, props.parent)
      }
      props.data.context?.appendItem()
      const addData = unref(list)?.[unref(list).length - 1] ||'root'
      designer?.setSelection(addData)
    }

    const isEditModel = computed(() => {
      return unref(designer?.model) === 'edit'
    })

    const _formItemProps = computed(() => {
      return props.data?.formItemProps
    })

    const _isLayout = computed(() => {
      return props.data?.formItemProps.isLayout
    })

    return () => {
      const _path = cloneDeep(props?.path || []);
      const _index = props?.index || 0;
      if (props.data?.formItemProps?.name) {
        _path[_index] = props.data.formItemProps.name
      }

      const addButton = () => {
        return unref(isEditModel) &&
          <div class="draggable-add">
            <div class="draggable-add-btn" onClick={withModifiers(handleAdd, ['stop'])}><span>添加面板</span></div>
          </div>
      }

      const renderContent = () => {
        return (
          unref(list)?.length ? <Collapse data-layout-type={'collapse'} {...props.data.componentProps}>
            {
              unref(list).map((element) => {
                return (
                  <CollapsePanel key={element.key} {...element.componentProps}>
                    <Selection
                      class={isEditModel.value && 'drag-area'}
                      data={element}
                      tag="div"
                      hasCopy={true}
                      hasDel={true}
                      parent={unref(list)}
                      style={{
                        padding: '20px 10px'
                      }}
                    >
                      <DraggableLayout
                        data={element.children}
                        data-layout-type={'item'}
                        parent={element}
                        path={_path}
                        index={_index + 1}
                      />
                    </Selection>
                  </CollapsePanel>
                )
              })
            }
          </Collapse> : (unref(isEditModel) ? <div class="draggable-empty">折叠面板</div> : <div></div>)
        )
      }
      return (
        <Selection {...useAttrs()} style={{ padding: isEditModel.value ? '16px' : '0px' }} hasCopy={true} hasDel={true} hasDrag={true} data={props.data} parent={props.parent}>
          {
            unref(_isLayout) ?
              <FormItem {...unref(_formItemProps)}>
                {renderContent()}
                {addButton()}
              </FormItem>
              : (
                <>
                  {renderContent()}
                  {addButton()}
                </>
              )
          }
        </Selection>
      )
    }
  }
})
