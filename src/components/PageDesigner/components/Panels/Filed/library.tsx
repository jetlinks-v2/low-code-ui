
import generatorData from '../../../utils/generatorData';
import { filedData } from '../../../utils/defaultData'
import DraggableWrap from '../../Draggable/DraggableWrap'
import { IconWidget } from '../../Icons';
import './index.less';
import { cloneDeep } from 'lodash-es';
import { useTool } from '@LowCode/components/PageDesigner/hooks';

const Library = defineComponent({
    name: 'Library',
    inheritAttrs: false,
    setup() {
        const { setSelection } = useTool()
        
        const handleClone = (element: any) => {
            const item = { ...generatorData(element) }
            return cloneDeep(item)
        }

        const slots = {
            item: ({ element }) => {
                return (
                    <div class="filed-item-card">
                        <div class="filed-item-card-icon">
                            <span style="width: 50px; height: 30px;">{IconWidget(element.type)}</span>
                        </div>
                        <div class="filed-item-card-text">{element.name}</div>
                    </div>
                )
            }
        }

        const options = {
            animation: 150,
            direction: 'horizontal',
            scroll: false,
            sort: false,
            group: { name: "j-canvas", pull: 'clone', put: false },
            ghostClass: 'ghost',
            clone: handleClone,
            onEnd: (e) => {
                if (e.to?.dataset?.layoutType !== 'filed-item') {
                    setSelection(e.item?._underlying_vm_ || 'root')
                }
            }
        }

        return () => {
            return (
                <div class="filed-container">
                    {filedData.map((element) => {
                        return (
                            <div key={element.id} class="filed-item">
                                <div class="filed-item-title">{element.name}</div>
                                {
                                    element.children?.length && (
                                        <DraggableWrap
                                            list={element?.children || []}
                                            {...options}
                                            class={"filed-item-children"}
                                            tag={'div'}
                                            v-slots={slots}
                                            item-key="type"
                                            data-layout-type={'filed-item'}
                                        ></DraggableWrap>
                                    )
                                }
                            </div>
                        )
                    })}
                </div>
            )
        };
    },
});

export default Library;
