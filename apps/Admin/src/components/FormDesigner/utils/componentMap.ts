import { CardSelect, Input, Textarea, Select, InputPassword, Switch, TreeSelect, DatePicker, RangePicker, TimePicker, TimeRangePicker } from 'jetlinks-ui-components'
import { Text,Tissue,Role,User,Product,Device } from '../components/Components/index'

const componentMap = {
    'input': Input,
    'text': Text,
    'tissue': Tissue,
    'role': Role,
    'user': User,
    'product': Product,
    'device': Device,
    'textarea': Textarea,
    'select-card': CardSelect,
    'select': Select,
    'input-password': InputPassword,
    'switch': Switch,
    'tree-select': TreeSelect,
    'date-picker': DatePicker,
    'range-picker': RangePicker,
    'time-picker': TimePicker,
    'time-range-picker': TimeRangePicker
}

export default componentMap;