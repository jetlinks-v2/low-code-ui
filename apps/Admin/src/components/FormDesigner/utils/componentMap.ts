import { CardSelect, InputNumber, Input, Textarea, Select, InputPassword, Switch, TreeSelect, DatePicker, RangePicker, TimePicker, TimeRangePicker } from 'jetlinks-ui-components'
import { Text, Upload } from '../components/Components/index'

const componentMap = {
    'input': Input,
    'text': Text,
    'textarea': Textarea,
    'input-number': InputNumber,
    'select-card': CardSelect,
    'select': Select,
    'input-password': InputPassword,
    'switch': Switch,
    'upload': Upload,
    'tree-select': TreeSelect,
    'date-picker': DatePicker,
    'range-picker': RangePicker,
    'time-picker': TimePicker,
    'time-range-picker': TimeRangePicker
}

export default componentMap;