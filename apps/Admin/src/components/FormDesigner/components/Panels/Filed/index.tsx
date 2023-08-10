
import { filedData } from '../../../utils/defaultData'
import { Scrollbar } from 'jetlinks-ui-components'
import DragGableWrap from '../../Draggable/DragGableWrap'
import { cloneDeep } from 'lodash-es';
import './index.less';
import ControlInsertionPlugin from '../../Draggable/ControlInsertionPlugin';
import { useTarget } from '@/components/FormDesigner/hooks';
import { addContext } from '@/components/FormDesigner/utils/addContext';
import { useFormDesignerStore } from '@/store';

const Filed = defineComponent({
    name: 'Filed',
    inheritAttrs: false,
    setup() {
        const _data: any = inject('FormDesigner')

        const designer = useFormDesignerStore()

        const {
            state,
            setSelection
        } = useTarget()

        const handleClone = (element) => {
            return cloneDeep(element)
        }

        const handleMove = () => {
            return true
        }

        const dragOptions = {
            ControlInsertion: true,
            dataSource: 'block',
            direction: 'horizontal',
            scroll: false,
            plugins: [ControlInsertionPlugin(_data)]
        }

        const addStore = (element: any) => {
            // const newElement = reactive(_data.wrapElement(cloneDeep(element)))
            // state.store.push(newElement)
            // addContext(newElement, state.store)
            // nextTick(() => {
            //     setSelection(newElement)
            //     setTimeout(() => {
            //         // _data.canvasScrollRef.value.setScrollTop(_data.canvasScrollRef.value.wrapRef.scrollHeight)
            //     }, 100)
            // })
        }

        const slots = {
            item: ({ element }) => {
                return (
                    <div class="filed-item-card" onClick={() => addStore(element)}>{element.name}</div>
                )
            }
        }

        return () => {
            return (
                <Scrollbar>
                    <div class="filed-container">
                        {filedData.map((element) => {
                            return (
                                <div key={element.key} class="filed-item">
                                    <div class="filed-item-title">{element.name}</div>
                                    {
                                        element.children?.length && (
                                            <DragGableWrap
                                                list={element.children}
                                                clone={handleClone}
                                                class="filed-item-children"
                                                sort={false}
                                                move={handleMove}
                                                {...dragOptions}
                                                group={
                                                    { name: 'j-canvas', pull: 'clone', put: false }
                                                }
                                                item-key="null"
                                                v-slots={slots}
                                            ></DragGableWrap>
                                        )
                                    }
                                </div>
                            )
                        })}
                    </div>
                </Scrollbar>
            )
        };
    },
});

export default Filed;