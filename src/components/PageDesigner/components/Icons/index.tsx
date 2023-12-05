import {
    ArrayTableSource,
    ButtonSource,
    CardSource,
    ObjectSource,
    SpaceSource,
    TextSource,
    DropdownSource,
    TimelineSource,
    InfoSource,
    SearchSource,
    TagSource,
    StepsSource,
    TabSource
} from './source';

const getIcon = (type: string) => {
    switch (type) {
        case 'text':
            return TextSource
        case 'button':
            return ButtonSource
        case 'dropdown':
            return DropdownSource
        case 'tag':
            return TagSource
        case 'form':
            return ObjectSource
        case 'steps':
            return StepsSource
        case 'info':
            return InfoSource
        case 'timeline':
            return TimelineSource
        case 'inline':
            return SpaceSource
        case 'card':
            return CardSource
        case 'search':
            return SearchSource
        case 'proTable':
            return ArrayTableSource
        case 'tabs':
            return TabSource
        default:
            return TextSource
    }
}

export const IconWidget = (type: string) => {
    const infer: any = getIcon(type)
    if (infer.type === 'path' || infer.type === 'g') {
        return (
            <svg
                viewBox="0 0 1024 1024"
                height={30}
                width={50}
                fill="currentColor"
                focusable="false"
                aria-hidden="true"
            >
                {infer}
            </svg>
        )
    }
    return infer
}