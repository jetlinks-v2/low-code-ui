import { Table, CardSelect, InputNumber, Input, Textarea, Select, InputPassword, Switch, TreeSelect, DatePicker, TimePicker } from 'jetlinks-ui-components'
import { Text,Tissue,Role,User,Product,Device,Upload, Geo, Form } from '../components/Components/index'

const componentMap = {
    'input': Input,
    'text': Text,
    'tissue': Tissue,
    'role': Role,
    'user': User,
    'product': Product,
    'device': Device,
    'textarea': Textarea,
    'input-number': InputNumber,
    'select-card': CardSelect,
    'select': Select,
    'input-password': InputPassword,
    'switch': Switch,
    'upload': Upload,
    'tree-select': TreeSelect,
    'date-picker': DatePicker,
    'table': Table,
    'time-picker': TimePicker,
    'geo': Geo,
    'form': Form
}

export default componentMap;