import {cloneDeep, debounce, omit} from "lodash-es"
import { appendChildItem, copyDataByKey, deleteDataByKey, handleCopyData } from "../utils/utils"
import { Modal } from 'jetlinks-ui-components'
import { uid } from "../utils/uid"
import { useProduct } from "@LowCode/store";
import { providerEnum } from "@LowCode/components/ProJect";

const useTool = () => {
    const designer: any = inject('PageDesigner')
    const delVisible = ref<boolean>(false)
    const product = useProduct();

    const isEditModel = computed(() => {
        return unref(designer?.model) === 'edit'
    })

    const isDragArea = computed(() => {
        return unref(isEditModel)
    })

    const _model = computed(() => {
        return unref(designer?.model)
    })

    /**
 * 保存数据
 */
    const onSaveData = () => {
        let menu = {}
        if (unref(designer.pageData).componentProps.isPage) {
            menu = {
                name: unref(designer.pageData).componentProps?.pageName,
                icon: unref(designer.pageData).componentProps?.pageIcon,
            }
        }
        const obj = {
            ...unref(designer.data),
            configuration: {
                type: "page-design",
                code: JSON.stringify(unref(designer.pageData)),
            },
            others: {
                ...designer.data.others,
                ...menu
            }
        };

        product.update(obj);
    };

    // 设置数据被选中
    const setSelection = (node: any) => {
        if (node === 'root') {
            designer.selected.value = [designer.pageData.value]
        } else {
            designer.selected.value = [node]
        }
        onSaveData()
        designer.isShowConfig.value = true
    }

    const setModel = (_type: 'preview' | 'edit') => {
        designer.model.value = _type
    }

    const isSelectedRoot = computed(() => {
        return !!designer.selected.value.find((item: any) => item.key === 'root')
    })

    const onAddChild = (newData: any, parent: any) => {
        const arr = appendChildItem(designer.pageData.value?.children, newData, parent)
        designer.pageData.value = {
            ...designer.pageData.value,
            children: arr || [],
        }
        setSelection(newData || 'root')
    }

    const onDelete = debounce(() => {
        const arr = designer.selected.value || []
        if (!arr?.length) return
        delVisible.value = true
        Modal.confirm({
            title: '确定删除组件及其配置？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                delVisible.value = false
                // 删除数据
                const _data = deleteDataByKey(designer.pageData.value.children, designer.selected.value)
                designer.pageData.value = {
                    ...designer.pageData.value,
                    children: _data?.arr || [],
                }

                designer.dependencies.value = omit(designer.dependencies.value, designer.selected.value.map((item: any) => item.key))

                setSelection(_data?.data || 'root')
            },
            onCancel() {
                delVisible.value = false
            },
        })
    }, 200)

    // 复制
    const onCopy = () => {
        if (unref(isSelectedRoot) || designer.focused.value) return
        designer.copyData.value = cloneDeep(designer.selected.value) || []
    }

    // 剪切
    const onShear = debounce(() => {
        if (unref(isSelectedRoot) || designer.focused.value) return
        designer.copyData.value = cloneDeep(designer.selected.value) || []
        const _data: any = deleteDataByKey(designer.pageData.value.children, designer.selected.value)
        designer.pageData.value = {
            ...designer.pageData.value,
            children: _data?.arr || [],
        }
        setSelection(_data?.data || 'root')
    }, 200)

    // 粘贴
    const onPaste = () => {
        if (!designer.selected.value?.length || designer.focused.value) return
        const list = (designer.copyData.value || []).map((item: any) => {
            return {
                ...item,
                formItemProps: {
                    ...item?.formItemProps,
                    label: 'copy_' + item.formItemProps?.label,
                    name: 'copy_' + item.formItemProps?.name
                },
                key: item.key + '_' + uid(),
                children: handleCopyData(item?.children || []),
            }
        })
        if (list.length && designer.selected.value?.length) {
            const dt = designer.selected.value?.[designer.selected.value.length - 1]
            designer.pageData.value = {
                ...designer.pageData.value,
                children: dt?.key === 'root' ? [...designer.pageData.value?.children, ...list] : copyDataByKey(designer.pageData.value?.children, list, dt),
            }
            setSelection(list?.[list.length - 1] || 'root')
            designer.copyData.value = []
        }
    }

    const getFormList = computed(() => {
        const list = product.getDataMapByType(providerEnum.FormPage);
        //   过滤掉自身
        const filterList = list.filter((item) => item.id !== designer?.data?.id);
        return filterList.map((item) => {
            return {
                label: item.title,
                value: item.id,
                code: item.configuration?.code,
            };
        });
    });

    return {
        isEditModel,
        isDragArea,
        _model,
        isSelectedRoot,
        setSelection,
        onDelete,
        onAddChild,
        onCopy,
        onShear,
        onPaste,
        setModel,
        getFormList
    }
}

export default useTool
