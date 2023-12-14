import {publish, subscribe} from '@jetlinks-web/utils';
import useTool from './useTool';
import { map } from 'lodash-es'

export const usePubsub = (publishKey: string, subValue: any, _depKeys: string | string[], _cb: ($dep?: string, $depValue?: any) => void, publishName?: string) => {
    const designer: any = inject('PageDesigner')
    const {isEditModel} = useTool()
    // 发布
    const onPublish = (key?: string, _name?: string, data?: any) => {
        if (key && !unref(isEditModel)) {
            publish(key, data)
        }
        if (key && designer?.pubsub && !map(designer?.pubsub?.value, 'value')?.includes(key)) {
            designer.pubsub.value.push({
                label: _name || key,
                value: key
            })
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
        onPublish(publishKey, publishName, subValue)
    }, {
        immediate: true
    })

    onSubscribe(_depKeys, _cb)

    return {
        onSubscribe
    }
}
