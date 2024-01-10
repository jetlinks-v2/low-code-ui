import {Form, Dropdown, Menu, MenuItem, Button} from 'jetlinks-ui-components'
import DraggableLayout from "../../Draggable/DraggableLayout"
import './index.less'
import {cloneDeep, omit} from "lodash-es"
import {uid} from "@LowCode/components/FormDesigner/utils/uid"
import CollectModal from '../../CollectModal/index.vue'
import {useProduct} from "@LowCode/store"
import {extractCssClass, insertCustomCssToHead} from "@LowCode/components/FormDesigner/utils/utils"
import {useMagicKeys, useElementHover} from '@vueuse/core'
import {request as axiosRequest} from "@jetlinks-web/core/src/request";

const Canvas = defineComponent({
    name: 'Canvas',
    inheritAttrs: false,
    customOptions: {},
    setup() {
        const designer: any = inject('FormDesigner')
        const product = useProduct()
        const canvasRef = ref<any>()
        const keys = useMagicKeys()
        const focused = useElementHover(canvasRef)

        const cssClassList = ref<string[]>([])

        const handleClick = () => {
            designer.setSelection('root')
        }

        const isEditModel = computed(() => {
            return unref(designer?.model) === 'edit'
        })

        watch(
            () => [keys?.['Ctrl']?.value, keys?.['Meta']?.value],
            ([v1, v2]) => {
                if(designer._ctrl?.value){
                    designer._ctrl.value = v1 || v2
                }
            },
        )

        watch(
            () => [keys?.['Ctrl+C']?.value, keys?.['Meta+C']?.value],
            ([v1, v2]) => {
                if(designer._other?.value){
                    designer._other.value = v1 || v2
                }
                if ((v1 || v2) && isEditModel?.value && designer?.focus?.value) {
                    designer?.onCopy?.()
                }
            },
        )

        watch(
            () => [keys?.['Ctrl+X']?.value, keys?.['Meta+X']?.value],
            ([v1, v2]) => {
                designer._other.value = v1 || v2
                if ((v1 || v2) && isEditModel?.value && designer?.focus?.value) {
                    designer?.onShear?.()
                }
            },
        )

        watch(
            () => [keys?.['Ctrl+V']?.value, keys?.['Meta+V']?.value],
            ([v1, v2]) => {
                designer._other.value = v1 || v2
                if ((v1 || v2) && isEditModel?.value && designer?.focus?.value) {
                    designer?.onPaste?.()
                }
            },
        )

        // 删除
        watch(
            () => [keys?.['Backspace']?.value, keys?.['Delete']?.value],
            ([v1, v2]) => {
                designer._other.value = v1 || v2
                if ((v1 || v2) && isEditModel.value && designer.focus?.value) {
                    if (!designer?.delVisible?.value) {
                        designer?.onDelete?.()
                    }
                }
            },
        )

        const getWidgetRef = (path: any) => {
            return unref(designer.refList)?.[path]
        }

        const _width = computed(() => {
            return !unref(designer.formData)?.children?.length ? "100%" : ''
        })

        watchEffect(() => {
            const arr = extractCssClass(unref(designer.formData)?.componentProps?.cssCode)
            cssClassList.value = arr
            insertCustomCssToHead(unref(designer.formData)?.componentProps?.cssCode, 'root')
        })

        watch(
            () => focused?.value,
            (newValue) => {
                if (designer.focus) {
                    designer.focus.value = newValue
                }
            },
            {
                immediate: true,
                deep: true
            }
        )

        const renderContent = () => {
            const Layout = (
                <DraggableLayout
                    path={[]}
                    index={0}
                    data-layout-type={'root'}
                    style={{
                        margin: '10px 10px 0 10px',
                        paddingTop: '10px',
                        height: '100%',
                        width: unref(_width)
                    }}
                    data={designer.formData.value?.children || []}
                    parent={designer.formData.value}
                    isRoot
                ></DraggableLayout>
            )

            return (
                <Form
                    ref={designer.formRef}
                    model={designer.formState}
                    {...omit(designer.formData.value?.componentProps, ['size', 'cssCode', 'eventCode'])}
                    onClick={unref(isEditModel) && handleClick}
                    class={[...unref(cssClassList)]}
                    onValidate={(name, status, errorMsgs) => {
                        if (designer.formData.value?.componentProps?.eventCode) {
                            const customFn = new Function('e', designer.formData.value?.componentProps?.eventCode)
                            customFn({getWidgetRef: getWidgetRef}, name, status, errorMsgs)
                        }
                    }}
                    style={{
                        height: "100%",
                        width: "100%"
                    }}
                >
                    {Layout}
                </Form>
            )
        }

        const renderChildren = () => {
            return <Dropdown
                trigger={['contextmenu']}
                onContextmenu={() => {
                    const flag = designer.selected.value.find((item: any) => item.key === 'root')
                    if (!flag) {
                        designer.setSelection('root')
                    }
                }}
                v-slots={{
                    overlay: () => {
                        return (
                            <Menu>
                                <MenuItem key="paste">
                                    <Button type="link" onClick={() => {
                                        designer?.onPaste?.()
                                    }}>粘贴</Button>
                                </MenuItem>
                            </Menu>
                        )
                    }
                }}
            >
                {renderContent()}
            </Dropdown>
        }

        const setValue = (_val: any) => {
            Object.assign(designer.formState, _val)
        }

        const onMountedFn = () => {
            const customFn = new Function('refs', designer.formData.value?.componentProps?.mountedCode)

            const obj = {
                axios: axiosRequest,
                myRef: {
                    setValue
                }
            }
            customFn(obj)
        }

        onMounted(() => {
            if (designer.formData.value?.componentProps?.mountedCode && !unref(isEditModel)) {
                onMountedFn()
            }
        })

        return () => {
            return (
                <div class="subject" ref={canvasRef}>
                    {unref(isEditModel) ? renderChildren() : renderContent()}
                    {unref(designer.collectVisible) && unref(isEditModel) && <CollectModal
                        onSave={(name: string) => {
                            const obj = {
                                key: uid(8),
                                name: name,
                                template: cloneDeep(unref(designer.collectData))
                            }
                            // 保存为模板
                            const arr = product.data?.[0]?.others?.formTemplate || []
                            const _data = {
                                ...product.data?.[0],
                                others: {
                                    ...product.data?.[0]?.others,
                                    formTemplate: [...arr, obj]
                                }
                            }
                            product.update(_data)
                            designer.collectData.value = undefined
                            designer.collectVisible.value = false
                        }}
                        onClose={() => {
                            designer.collectVisible.value = false
                        }}
                    />}
                </div>
            )
        }
    }
})

export default Canvas
