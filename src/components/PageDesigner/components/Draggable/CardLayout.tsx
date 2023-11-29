import DraggableLayout from './DraggableLayout'
import Selection from '../Selection/index'
import './index.less'
import { cloneDeep, omit } from 'lodash-es'
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
    },
    setup(props) {
        const { isDragArea, layoutPadStyle } = useTool()

        const _data = computed(() => {
            return props.data
        })

        const list = computed(() => {
            return unref(_data)?.children || []
        })


        return () => {

            return (
                <Selection {...useAttrs()} style={unref(layoutPadStyle)} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    <div
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
                                        />
                                    </Selection>
                                )
                            })
                        }
                    </div>
                </Selection>
            )
        }
    }
})
