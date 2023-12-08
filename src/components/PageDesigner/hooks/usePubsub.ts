import {publish, subscribe} from '@jetlinks-web/utils';
import useTool from './useTool';

export const usePubsub = (publishKey: string, subValue: any, _depKeys: string | string[], _cb: ($dep?: string, $depValue?: any) => void) => {
    const designer: any = inject('PageDesigner')
    const {isEditModel} = useTool()
    // 发布
    const onPublish = (key?: string, data?: any) => {
        if (key && !unref(isEditModel)) {
            publish(key, data)
        }
        if (key && designer?.pubsub && !designer?.pubsub?.value?.includes(key)) {
            designer.pubsub.value.push(key)
        }
    }

    // 订阅
    const onSubscribe = (keys: string | string[], cb: ($dep?: string, $depValue?: any) => void) => {
        if (!unref(isEditModel)) {
            if (keys?.length) {
                subscribe(keys, cb)
            } else {
                cb()
            }
        }
    }

    watch(() => JSON.stringify(subValue), () => {
        onPublish(publishKey, subValue)
    }, {
        immediate: true
    })

    onSubscribe(_depKeys, _cb)

    return {
        onSubscribe
    }
}
