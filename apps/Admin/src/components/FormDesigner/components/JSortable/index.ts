import { insertNodeAt, removeNode } from "./util/htmlHelper";
import {
    getComponentAttributes,
    createSortableOption,
    getValidSortableEntries
} from "./core/componentBuilderHelper";
import { computeComponentStructure } from "./core/renderHelper";
import { events } from "./core/sortableEvents";
import { h, defineComponent, nextTick } from "vue";
import { MultiDrag, Sortable } from "sortablejs";

Sortable.mount(new MultiDrag());

function emit(evtName, evtData) {
    nextTick(() => this.$emit(evtName.toLowerCase(), evtData));
}

function manage(evtName) {
    return (evtData, originalElement) => {
        if (this.realList !== null) {
            return this[`onDrag${evtName}`](evtData, originalElement);
        }
    };
}

function manageAndEmit(evtName) {
    const delegateCallBack = manage.call(this, evtName);
    return (evtData, originalElement) => {
        delegateCallBack.call(this, evtData, originalElement);
        emit.call(this, evtName, evtData);
    };
}

let draggingElement = null;

const draggable = defineComponent({
    name: "draggable",
    inheritAttrs: false,
    props: {
        list: {
            type: Array,
            required: false, // 传入的数据
            default: null
        },
        modelValue: {
            type: Array,
            required: false, // 双向绑定
            default: null
        },
        itemKey: {
            type: [String, Function],
            required: true // item的key
        },
        clone: {
            type: Function, // 复制后的数据
            default: original => {
                return original;
            }
        },
        tag: {
            type: String, // Sortable的tag
            default: "div"
        },
        move: {
            type: Function, // 
            default: null
        },
        componentData: { // 
            type: Object,
            required: false,
            default: null
        }
    },
    emits: [
        "update:modelValue", // 双向绑定
        "change", // 
        ...[...events.manageAndEmit, ...events.emit].map(evt => evt.toLowerCase())
    ],
    data() {
        return {
            error: false
        };
    },
    created() {
        // list和modelValue只能传入一个人
        if (this.list !== null && this.modelValue !== null) {
            console.error(
                "modelValue and list props are mutually exclusive! Please set one or another."
            );
        }
    },
    mounted() {
        if (this.error) {
            return;
        }
        // $attrs: 一个包含了组件所有透传 attributes 的对象。
        // attributes: 是指由父组件传入，且没有被子组件声明为 props 或是组件自定义事件的 attributes 和事件处理函数。
        const { $attrs, $el, componentStructure } = this;
        // $el: 该组件实例管理的 DOM 根节点。
        componentStructure?.updated();

        const sortableOptions = createSortableOption({
            $attrs,
            callBackBuilder: {
                manageAndEmit: event => manageAndEmit.call(this, event),
                emit: event => emit.bind(this, event),
                manage: event => manage.call(this, event)
            }
        });
        // console.log($el)
        // console.log(sortableOptions)
        const targetDomElement = $el.nodeType === 1 ? $el : $el.parentElement;
        this._sortable = new Sortable(targetDomElement, sortableOptions);
        // console.log(this._sortable)
        this.targetDomElement = targetDomElement;
        targetDomElement.__draggable_component__ = this;
    },
    updated() { // 在组件因为一个响应式状态变更而更新其 DOM 树之后调用
        this.componentStructure?.updated();
    },
    beforeUnmount() {
        if (this._sortable !== undefined) this._sortable.destroy();
    },
    computed: {
        realList() {
            const { list } = this;
            return list ? list : this.modelValue;
        },

        getKey() {
            const { itemKey } = this;
            if (typeof itemKey === "function") {
                return itemKey;
            }
            return element => element[itemKey];
        }
    },

    watch: {
        $attrs: {
            handler(newOptionValue) {
                const { _sortable } = this;
                if (!_sortable) return;
                getValidSortableEntries(newOptionValue).forEach(([key, value]) => {
                    _sortable.option(key, value);
                });
            },
            deep: true
        }
    },

    methods: {
        getUnderlyingVm(domElement) {
            return this.componentStructure.getUnderlyingVm(domElement) || null;
        },

        getUnderlyingPotencialDraggableComponent(htmElement) {
            return htmElement.__draggable_component__;
        },

        emitChanges(evt) {
            nextTick(() => this.$emit("change", evt));
        },

        alterList(onList) {
            if (this.list) {
                onList(this.list);
                return;
            }
            const newList = [...this.modelValue];
            onList(newList);
            this.$emit("update:modelValue", newList);
        },

        spliceList() {
            // @ts-ignore
            const spliceList = list => list.splice(...arguments);
            this.alterList(spliceList);
        },

        updatePosition(oldIndex, newIndex) {
            const updatePosition = list =>
                list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]);
            this.alterList(updatePosition);
        },

        getRelatedContextFromMoveEvent({ to, related }) {
            const component = this.getUnderlyingPotencialDraggableComponent(to);
            if (!component) {
                return { component };
            }
            const list = component.realList;
            const context = { list, component };
            if (to !== related && list) {
                const destination = component.getUnderlyingVm(related) || {};
                return { ...destination, ...context };
            }
            return context;
        },

        getVmIndexFromDomIndex(domIndex) {
            return this.componentStructure.getVmIndexFromDomIndex(
                domIndex,
                this.targetDomElement
            );
        },

        onDragStart(evt) {
            this.context = this.getUnderlyingVm(evt.item);
            evt.item._underlying_vm_ = this.clone(this.context.element);
            draggingElement = evt.item;
        },

        onDragAdd(evt) {
            const element = evt.item._underlying_vm_;
            if (element === undefined) {
                return;
            }
            removeNode(evt.item);
            const newIndex = this.getVmIndexFromDomIndex(evt.newIndex);
            // @ts-ignore
            this.spliceList(newIndex, 0, element);
            const added = { element, newIndex };
            this.emitChanges({ added });
        },

        onDragRemove(evt) {
            insertNodeAt(this.$el, evt.item, evt.oldIndex);
            if (evt.pullMode === "clone") {
                removeNode(evt.clone);
                return;
            }
            const { index: oldIndex, element } = this.context;
            // @ts-ignore
            this.spliceList(oldIndex, 1);
            const removed = { element, oldIndex };
            this.emitChanges({ removed });
        },

        onDragUpdate(evt) {
            removeNode(evt.item);
            insertNodeAt(evt.from, evt.item, evt.oldIndex);
            const oldIndex = this.context.index;
            const newIndex = this.getVmIndexFromDomIndex(evt.newIndex);
            this.updatePosition(oldIndex, newIndex);
            const moved = { element: this.context.element, oldIndex, newIndex };
            this.emitChanges({ moved });
        },

        computeFutureIndex(relatedContext, evt) {
            if (!relatedContext.element) {
                return 0;
            }
            const domChildren = [...evt.to.children].filter(
                el => el.style["display"] !== "none"
            );
            const currentDomIndex = domChildren.indexOf(evt.related);
            const currentIndex = relatedContext.component.getVmIndexFromDomIndex(
                currentDomIndex
            );
            const draggedInList = domChildren.indexOf(draggingElement) !== -1;
            return draggedInList || !evt.willInsertAfter
                ? currentIndex
                : currentIndex + 1;
        },

        onDragMove(evt, originalEvent) {
            const { move, realList } = this;
            if (!move || !realList) {
                return true;
            }

            const relatedContext = this.getRelatedContextFromMoveEvent(evt);
            const futureIndex = this.computeFutureIndex(relatedContext, evt);
            const draggedContext = {
                ...this.context,
                futureIndex
            };
            const sendEvent = {
                ...evt,
                relatedContext,
                draggedContext
            };
            return move(sendEvent, originalEvent);
        },

        onDragEnd() {
            draggingElement = null;
        }
    },
    render() {
        try {
            this.error = false;
            const { $slots, $attrs, tag, componentData, realList, getKey } = this;
            const componentStructure = computeComponentStructure({
                $slots,
                tag,
                realList,
                getKey
            });
            this.componentStructure = componentStructure;
            const attributes = getComponentAttributes({ $attrs, componentData });
            return componentStructure.render(h, attributes);
        } catch (err: any) {
            this.error = true;
            return h("pre", { style: { color: "red" } }, err.stack);
        }
    }
});

export default draggable



