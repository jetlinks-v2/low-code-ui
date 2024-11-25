
import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import { Collapse, CollapsePanel, FormItem, Badge } from 'jetlinks-ui-components'
import './index.less'
import { withModifiers } from 'vue'
import { cloneDeep, map, omit } from 'lodash-es'
import { useTool } from '../../hooks'
import generatorData from '../../utils/generatorData'

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
    },
    visible: {
      type: Boolean,
      default: true
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const designer: any = inject('FormDesigner')

    const { isEditModel, isDragArea, layoutPadStyle } = useTool()

    const list = computed(() => {
      return props.data?.children || []
    })

    const handleAdd = () => {
      const _item = generatorData({
        type: props.data?.type + '-item',
        children: [],
        formItemProps: {
          // name: props.data?.type + '-item' + '_' + uid(6),
          isLayout: false
        },
        componentProps: {
          name: 'Title'
        }
      })
      designer.onAddChild(_item, props.data)
    }

    const _formItemProps = computed(() => {
      return props.data?.formItemProps
    })

    const _isLayout = computed(() => {
      return props.data?.formItemProps.isLayout
    })

    return () => {
      let _path = cloneDeep(props?.path || []);
      let _index: number = props?.index || 0;
      if (props.data?.formItemProps?.name) {
        _path[_index] = props.data.formItemProps.name
      }

      const addButton = () => {
        return unref(isEditModel) &&
          <div class="draggable-add">
            <div class="draggable-add-btn" onClick={withModifiers(handleAdd, ['stop'])}><span>添加面板</span></div>
          </div>
      }

      const _headerContent = (_element: any) => {
        if (unref(isEditModel)) {
          const _arr = map(_element?.children || [], 'key').filter(i => map(designer.errorKey.value, 'key').includes(i))
          return <div>
            <Badge count={_arr?.length || 0}>{_element?.componentProps?.name}</Badge>
          </div>
        } else {
          return _element?.componentProps?.name
        }
      }

      const renderContent = () => {
        return (
          unref(list)?.length ? <Collapse data-layout-type={'collapse'} {...props.data.componentProps}>
            {
              unref(list).map((element) => {
                if (element.formItemProps?.name) {
                  _path = [..._path, element.formItemProps?.name]
                  _index = _index + 1
                }

                return (
                  <CollapsePanel
                    key={element.key}
                    {...omit(element.componentProps, 'header')}
                    header={_headerContent(element)}
                  >
                    <Selection
                      class={unref(isDragArea) && 'drag-area'}
                      data={element}
                      tag="div"
                      hasCopy={true}
                      hasDel={true}
                      parent={unref(list)}
                      // style={{
                      //   padding: '20px 10px'
                      // }}
                    >
                      <DraggableLayout
                        data={element.children}
                        data-layout-type={'item'}
                        parent={element}
                        path={_path}
                        index={unref(_isLayout) ? _index + 1 : _index}
                        visible={props.visible}
                        editable={props.editable}
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
        <Selection {...useAttrs()} style={unref(layoutPadStyle)} hasCopy={true} hasDel={true} hasDrag={true} data={props.data} parent={props.parent}>
          {
            unref(_isLayout) ?
              <FormItem {...unref(_formItemProps)} validateFirst={true}>
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
