import { InputNumber, Textarea, Select, InputPassword, Switch, TreeSelect, DatePicker, TimePicker, CheckboxGroup, RadioGroup } from 'jetlinks-ui-components'
import { Text,Org,Role,User,Product,Device,Upload, Geo, Form, CardSelect , Input ,CostStructure, Editor, NumberStep} from '../components/Components/index'

const componentMap = {
    // 'input': Input,
    'input': Input,
    // 'input-group': InputGroup,
    'text': Text,
    'org': Org,
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
    'time-picker': TimePicker,
    'geo': Geo,
    'form': Form,
    'cost-structure' : CostStructure,
    'checkbox': CheckboxGroup,
    'radio': RadioGroup,
    'editor': Editor,
    'number-step': NumberStep
}

export default componentMap;