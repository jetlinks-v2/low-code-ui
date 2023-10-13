import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import { Card, FormItem } from 'jetlinks-ui-components'
import './index.less'
import { cloneDeep } from 'lodash-es'
import { useTool } from '../../hooks'

export default defineComponent({
    name: 'CardLayout',
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
        }
    },
    setup(props) {
        const { isDragArea, layoutPadStyle } = useTool()

        const _data = computed(() => {
            return props.data
        })

        const list = computed(() => {
            return unref(_data)?.children || []
        })

        const _formItemProps = computed(() => {
            return _data.value?.formItemProps
        })

        const _isLayout = computed(() => {
            return props.data?.formItemProps.isLayout
        })

        return () => {
            const _path = cloneDeep(props?.path || []);
            const _index = props?.index || 0;

            if (unref(_data)?.formItemProps?.name) {
                _path[_index] = unref(_data).formItemProps.name
            }

            const renderContent = () => {
                return (
                    <Card
                        data-layout-type={'card'}
                        {...unref(_data).componentProps}
                    >
                        {
                            unref(list).map(element => {
                                return (
                                    <Selection
                                        class={unref(isDragArea) && 'drag-area'}
                                        data={element}
                                        tag="div"
                                        hasCopy={true}
                                        hasDel={unref(list).length > 1}
                                        parent={unref(list)}
                                    >
                                        <DraggableLayout
                                            data-layout-type={'card-item'}
                                            data={element.children}
                                            parent={element}
                                            path={_path}
                                            index={_index + 1}
                                            visible={props.visible}
                                        />
                                    </Selection>
                                )
                            })
                        }
                    </Card>
                )
            }
            return (
                <Selection {...useAttrs()} style={unref(layoutPadStyle)} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    {
                        unref(_isLayout) ?
                            <FormItem {...unref(_formItemProps)} validateFirst={true}>
                                {renderContent()}
                            </FormItem>
                            : renderContent()
                    }
                    <div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{props.data?.componentProps?.description}</div>
                </Selection>
            )
        }
    }
})
