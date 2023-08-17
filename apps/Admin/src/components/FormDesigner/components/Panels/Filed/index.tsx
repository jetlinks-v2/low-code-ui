
import { filedData } from '../../../utils/defaultData'
import { Scrollbar } from 'jetlinks-ui-components'
import DragGableWrap from '../../Draggable/DragGableWrap'
import { cloneDeep, omit } from 'lodash-es';
import './index.less';
import { onMove, onEnd } from '../../Draggable/ControlInsertionPlugin';
import { useFormDesignerStore } from '@/store';
import generatorData from '@/components/FormDesigner/utils/generatorData';
import { Card, AIcon } from 'jetlinks-ui-components';

const Filed = defineComponent({
    name: 'Filed',
    inheritAttrs: false,
    setup() {
        const designer = useFormDesignerStore()

        const handleClone = (element) => {
            const item = { ...generatorData(omit(element, ['icon'])) }
            return cloneDeep(item)
        }

        const handleMove = () => {
            return true
        }

        const dragOptions = {
            dataSource: 'block',
            direction: 'horizontal',
            scroll: false,
        }

        const slots = {
            item: ({ element }) => {
                return (
                    <div class="filed-item-card">
                        <Card hoverable>
                            <div class="filed-item-card-item">
                                <AIcon type={element.icon} style={{ fontSize: '25px' }} />
                                <span>{element.name}</span>
                            </div>
                        </Card>
                    </div>
                )
            }
        }

        return () => {
            return (
                <div>
                    <Scrollbar>
                        <div class="filed-container">
                            {filedData.map((element) => {
                                return (
                                    <div key={element.id} class="filed-item">
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
                                                    model="edit"
                                                    item-key="null"
                                                    v-slots={slots}
                                                    onMove={(e) => {
                                                        onMove(e, designer)
                                                    }}
                                                    onEnd={(e) => {
                                                        onEnd(e, designer)
                                                    }}
                                                ></DragGableWrap>
                                            )
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </Scrollbar>
                </div>
            )
        };
    },
});

export default Filed;