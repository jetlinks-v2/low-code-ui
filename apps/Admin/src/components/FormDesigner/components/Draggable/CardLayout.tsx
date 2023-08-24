import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import { Card, FormItem } from 'jetlinks-ui-components'
import './index.less'
import { cloneDeep } from 'lodash-es'

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
        }
    },
    setup(props) {
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
                                        class={'drag-area'}
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
                                        />
                                    </Selection>
                                )
                            })
                        }
                    </Card>
                )
            }
            return (
                <Selection {...useAttrs()} style={{ padding: '16px' }} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    {
                        unref(_isLayout) ?
                            <FormItem {...unref(_formItemProps)}>
                                {renderContent()}
                            </FormItem>
                            : renderContent()
                    }

                </Selection>
            )
        }
    }
})
