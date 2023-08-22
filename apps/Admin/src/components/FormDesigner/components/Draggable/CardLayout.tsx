import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import { Card } from 'jetlinks-ui-components'
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
        const list = computed(() => {
            return props.data?.children || []
        })
        return () => {
            const _path = cloneDeep(props?.path || []);
            const _index = props?.index || 0;
            if(props.data?.formItemProps?.name) {
                _path[_index] = props.data.formItemProps.name
            }
            return (
                <Selection {...useAttrs()} style={{ padding: '16px' }} hasDrag={true} hasDel={true} hasCopy={true} data={props.data} parent={props.parent}>
                    <Card data-layout-type={'card'} {...props.data.componentProps}>
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
                </Selection>
            )
        }
    }
})
