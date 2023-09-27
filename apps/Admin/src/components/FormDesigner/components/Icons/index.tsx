import { ArrayTableSource, CardSource, CollapseSource, DatePickerSource, GridSource, InputSource, NumberPickerSource, ObjectSource, PasswordSource, RadioGroupSource, SelectSource, SpaceSource, SwitchSource, TabSource, TextAreaSource, TextSource, TimePickerSource, TreeSelectSource, UploadSource } from './source';

const getIcon = (type: string) => {
    switch (type) {
        case 'input':
            return InputSource
        case 'text':
            return TextSource
        case 'textarea':
            return TextAreaSource
        case 'input-number':
            return NumberPickerSource
        case 'select-card':
            return RadioGroupSource
        case 'input-password':
            return PasswordSource
        case 'upload':
            return UploadSource
        case 'switch':
            return SwitchSource
        case 'form':
            return ObjectSource
        case 'select':
            return SelectSource
        case 'tree-select':
            return TreeSelectSource
        case 'date-picker':
            return DatePickerSource
        case 'time-picker':
            return TimePickerSource
        case 'table':
            return ArrayTableSource
        case 'card':
            return CardSource
        case 'grid':
            return GridSource
        case 'tabs':
            return TabSource
        case 'collapse':
            return CollapseSource
        case 'space':
            return SpaceSource
        case 'org':
            return InputSource
        case 'user':
            return InputSource
        case 'role':
            return InputSource
        case 'geo':
            return InputSource
        case 'product':
            return InputSource
        case 'device':
            return InputSource
        default:
            return InputSource
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