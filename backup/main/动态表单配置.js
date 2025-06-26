// components-config.js

// 表单的初始数据模型，可以根据需要预定义一些字段
// 当组件配置中的 valueName 对应这里的键时，其 defaultValue 会被这里的初始值覆盖（如果存在）
// 或者，可以在 Vue 实例的 created 钩子中，根据组件配置的 defaultValue 来初始化 formData
const initialFormData = {
  name: '初始姓名',
  category: 'option2' // 预设 category 的值
  // isVisible: true, // 可以由组件的 defaultValue 定义
}

// 组件配置列表
const dynamicContentConfig = [
  {
    component: 'el-input',
    valueName: 'name', // 对应 formData.name
    defaultValue: '默认姓名', // 如果 initialFormData.name 不存在，则使用此值
    props: {
      label: '姓名',
      placeholder: '请输入姓名',
      clearable: true,
      prefixIcon: 'el-icon-user'
    },
    events: {
      change: function (val) {
        console.log('[Event] 姓名 Input "change":', val)
      }
    }
  },
  {
    component: 'el-select',
    valueName: 'category', // 对应 formData.category
    defaultValue: 'option1', // 如果 initialFormData.category 不存在，则使用此值
    props: {
      label: '类别',
      placeholder: '请选择类别',
      filterable: true // 允许筛选
    },
    options: [
      { label: '美食', value: 'food' },
      { label: '科技', value: 'tech' },
      { label: '旅游 (禁用)', value: 'travel', disabled: true },
      { label: '体育', value: 'sports' }
    ],
    events: {
      change: function (val) {
        console.log('[Event] 类别 Select "change":', val)
      }
    }
  },
  {
    component: 'el-input-number',
    valueName: 'age', // 对应 formData.age
    defaultValue: 18,
    props: {
      label: '年龄',
      min: 0,
      max: 120,
      step: 1,
      controlsPosition: 'right'
    },
    events: {
      change: function (currentValue, oldValue) {
        console.log('[Event] 年龄 InputNumber "change":', currentValue, oldValue)
      }
    }
  },
  {
    component: 'el-switch',
    valueName: 'isActive', // 对应 formData.isActive
    defaultValue: true,
    props: {
      label: '激活状态',
      activeText: '已激活',
      inactiveText: '未激活',
      activeColor: '#13ce66',
      inactiveColor: '#ff4949'
    },
    events: {
      change: function (val) {
        console.log('[Event] 激活状态 Switch "change":', val)
      }
    }
  },
  {
    component: 'el-date-picker',
    valueName: 'birthDate', // 对应 formData.birthDate
    defaultValue: '', // 或者 new Date()
    props: {
      label: '出生日期',
      type: 'date', // 可选: 'year', 'month', 'date', 'dates', 'week', 'datetime', 'datetimerange', 'daterange', 'monthrange'
      placeholder: '选择日期',
      format: 'yyyy 年 MM 月 dd 日', // 显示格式
      valueFormat: 'yyyy-MM-dd', // 绑定值的格式
      clearable: true
    },
    events: {
      change: function (val) {
        console.log('[Event] 出生日期 DatePicker "change":', val)
      }
    }
  },
  {
    component: 'el-time-picker',
    valueName: 'meetingTime', // 对应 formData.meetingTime
    defaultValue: '', // 或者 new Date(2023, 1, 1, 10, 30)
    props: {
      label: '会议时间',
      isRange: false, // true 则为时间范围选择器
      placeholder: '选择时间',
      // startPlaceholder: '开始时间', (isRange: true 时)
      // endPlaceholder: '结束时间', (isRange: true 时)
      // rangeSeparator: '至', (isRange: true 时)
      format: 'HH:mm:ss',
      valueFormat: 'HH:mm:ss',
      pickerOptions: {
        // selectableRange: '09:00:00 - 18:30:00' // 可选时间范围
      }
    },
    events: {
      change: function (val) {
        console.log('[Event] 会议时间 TimePicker "change":', val)
      }
    }
  },
  {
    component: 'el-color-picker',
    valueName: 'themeColor', // 对应 formData.themeColor
    defaultValue: '#409EFF',
    props: {
      label: '主题颜色',
      showAlpha: true // 是否支持透明度
      // predefine: ['#ff4500', '#ff8c00', '#ffd700'] // 预定义颜色
    },
    events: {
      change: function (val) {
        console.log('[Event] 主题颜色 ColorPicker "change":', val)
      }
    }
  },
  {
    component: 'el-slider',
    valueName: 'volume', // 对应 formData.volume
    defaultValue: 50,
    props: {
      label: '音量',
      min: 0,
      max: 100,
      step: 1,
      showInput: true // 是否显示输入框，仅在非范围选择时有效
      // showStops: true, // 是否显示间断点
      // marks: { 0: '静音', 50: '舒适', 100: '最大' } // 标记
    },
    events: {
      change: function (val) {
        console.log('[Event] 音量 Slider "change":', val)
      }
      // input: function(val) { console.log('[Event] 音量 Slider "input":', val); } // 拖动时触发
    }
  },
  {
    component: 'el-rate',
    valueName: 'satisfaction', // 对应 formData.satisfaction
    defaultValue: 3,
    props: {
      label: '满意度',
      max: 5
      // colors: ['#99A9BF', '#F7BA2A', '#FF9900'], // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
      // voidColor: '#C6D1DE',
      // disabledVoidColor: '#EFF2F7',
      // iconClasses: ['el-icon-star-on', 'el-icon-star-on','el-icon-star-on'], // 等同于 { 2: 'el-icon-star-off', 4: 'el-icon-star-on', 5: 'el-icon-star-on' }
      // voidIconClass: 'el-icon-star-off',
      // disabledVoidIconClass: 'el-icon-star-on',
      // showText: true,
      // texts: ['极差', '失望', '一般', '满意', '惊喜'],
      // textColor: '#1F2D3D',
      // allowHalf: true // 是否允许半选
    },
    events: {
      change: function (val) {
        console.log('[Event] 满意度 Rate "change":', val)
      }
    }
  },
  {
    component: 'el-upload',
    valueName: 'fileList', // 通常 v-model 绑定的是 file-list
    defaultValue: [], // 初始文件列表
    props: {
      label: '文件上传',
      action: 'https://jsonplaceholder.typicode.com/posts/' // 必填，上传的地址
      // multiple: true,
      // limit: 3,
      // autoUpload: false, // 是否在选取文件后立即进行上传
      // listType: 'picture-card', // 文件列表的类型: text/picture/picture-card
      // drag: true, // 是否启用拖拽上传
      // accept: '.jpg,.jpeg,.png', // 接受上传的文件类型
      // onPreview: function(file) { console.log('Upload onPreview:', file); },
      // onRemove: function(file, fileList) { console.log('Upload onRemove:', file, fileList); return true; /* 返回 false 可阻止删除 */ },
      // onSuccess: function(response, file, fileList) { console.log('Upload onSuccess:', response, file, fileList); },
      // onError: function(err, file, fileList) { console.log('Upload onError:', err, file, fileList); },
      // onProgress: function(event, file, fileList) { console.log('Upload onProgress:', event, file, fileList); },
      // onChange: function(file, fileList) { console.log('Upload onChange (文件状态改变):', file, fileList); }, // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      // beforeUpload: function(file) { console.log('Upload beforeUpload:', file); return true; /* 返回 false 可阻止上传 */ },
      // httpRequest: function(options) { /* 自定义上传方法, options 包含 file, filename, action 等 */ console.log('Custom HTTP Request:', options); /* 通常需要手动发起 XHR */}
    },
    slot: `<el-button size="small" type="primary">点击上传</el-button><div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>`, // 使用HTML字符串作为插槽
    events: {
      // el-upload 的事件通常通过 props 中的 onXXX 回调来处理
      // 如果要通过 v-on 绑定，确保 el-upload 内部 $emit 了这些事件
      // 对于 fileList 的双向绑定，通常是 :file-list.sync="formData.fileList" 或 :file-list="formData.fileList" @change="handleFileListChange"
    }
  },
  {
    component: 'el-button',
    props: {
      type: 'primary',
      icon: 'el-icon-s-promotion',
      round: true
    },
    events: {
      click: function () {
        alert('动态配置的提交按钮被点击！') /* 通常这里会访问 this.formData */
      }
    },
    slot: '提交表单'
  },
  {
    component: 'el-alert',
    props: {
      title: '提示信息',
      type: 'info', // success/warning/info/error
      description: '这是一段通过动态配置生成的描述性文字。',
      closable: true, // 是否可关闭
      center: false, // 文字是否居中
      showIcon: true // 是否显示图标
      // effect: 'light' or 'dark'
    },
    events: {
      close: function () {
        console.log('Alert closed.')
      }
    }
    // slot: '这里是默认插槽内容，会覆盖 description' // 如果提供了 slot, description 会被忽略
  }
]

// 如果使用 ES Modules (在支持 <script type="module"> 的现代浏览器或构建工具中)
// export { initialFormData, dynamicContentConfig };

// 如果是在传统 <script> 标签中引入，可以将它们挂载到 window 对象上
// window.myAppConfig = { initialFormData, dynamicContentConfig };
