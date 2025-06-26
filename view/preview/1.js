;[
  {
    id: 'd9487685358ef815c6',
    name: 'card_0',
    type: 'card',
    level: 1,
    parentId: '0',
    seq: 0,
    props: {
      title: '面板标题',
      headFontColor: '#000',
      headBgColor: '#fff',
      isShrink: 'false',
      isFull: 'false',
      className: ''
    },
    events: []
  },
  {
    id: '7238f589dc84f88c52',
    name: 'grid_1',
    type: 'grid',
    level: 1,
    parentId: '0',
    seq: 1,
    props: {
      cols: '2',
      space: 'layui-col-space10',
      className: ''
    },
    events: []
  },
  {
    id: '1934542030854586368',
    name: null,
    type: 'gridCols',
    level: 2,
    parentId: '7238f589dc84f88c52',
    seq: 0,
    props: {
      cols: 6
    },
    events: []
  },
  {
    id: '1934542030854586369',
    name: null,
    type: 'gridCols',
    level: 2,
    parentId: '7238f589dc84f88c52',
    seq: 1,
    props: {
      cols: 6
    },
    events: []
  },
  {
    id: '67a8f78a3a8688944a',
    name: 'flex_2',
    type: 'flex',
    level: 1,
    parentId: '0',
    seq: 2,
    props: {
      gap: '10',
      wrap: 'true',
      alignItems: 'center',
      justify: 'flex-start'
    },
    events: []
  },
  {
    id: 'e538528daf81d82e79',
    name: 'table_3',
    type: 'table',
    level: 1,
    parentId: '0',
    seq: 3,
    props: {
      dataSource: '',
      colsDynamic: 'false',
      data: [],
      limit: '100',
      page: 'true',
      title: '',
      height: 500,
      init: 'true',
      cols: [],
      tableCodeId: 'dHMhx3EP',
      method: 'post'
    },
    events: []
  },
  {
    id: 'b8c899809a8958200e',
    name: 'echartsPie_4',
    type: 'echartsPie',
    level: 1,
    parentId: '0',
    seq: 4,
    props: {
      dataSource: '',
      unit: '',
      init: 'true',
      chartsType: 'pie',
      chartsRadius: 'false',
      text: '',
      subtext: '',
      titleAlign: 'left',
      height: '500px',
      borderRadius: 'fasle',
      legend: 'false',
      series: [
        {
          name: '饼图',
          center: ['50%', '50%'],
          type: 'pie'
        }
      ]
    },
    events: []
  },
  {
    id: '4a48bd8aa481987e4b',
    name: 'echartsBarLine_5',
    type: 'echartsBarLine',
    level: 1,
    parentId: '0',
    seq: 5,
    props: {
      dataSource: '',
      init: 'true',
      height: '500px',
      titleAlign: '',
      text: '',
      subtext: '',
      xAxis: {
        type: 'category'
      },
      yAxis: [
        {
          name: ''
        }
      ],
      series: [
        {
          unit: '',
          type: 'bar',
          yIndex: ''
        }
      ],
      unit: '',
      type: 'bar',
      yIndex: '',
      name: ''
    },
    events: []
  },
  {
    id: '1e08fb8f458d48c594',
    name: 'fnsrsbh_8',
    type: 'fnsrsbh',
    level: 1,
    parentId: '0',
    seq: 6,
    props: {
      title: '纳税人识别号',
      name: 'fnsrsbh',
      type: 'text',
      required: 'false',
      placeholder: '请输入纳税人识别号',
      defaultType: '1',
      defaultValue: '',
      params: ''
    },
    events: []
  },
  {
    id: '91782a8a5288f8887e',
    name: 'frkrq_9',
    type: 'frkrq',
    level: 1,
    parentId: '0',
    seq: 7,
    props: {
      title: '入库日期',
      range: 'true',
      name: 'frkrq',
      type: 'month',
      required: 'false',
      placeholder: '请选择日期',
      defaultValue: '',
      params: ''
    },
    events: []
  },
  {
    id: 'eac8a6885f84c8a721',
    name: 'input_10',
    type: 'input',
    level: 1,
    parentId: '0',
    seq: 8,
    props: {
      title: '标题',
      name: '',
      type: 'text',
      required: 'false',
      placeholder: '请输入',
      defaultValue: '',
      params: ''
    },
    events: []
  },
  {
    id: '0a48a385ec8f88d42a',
    name: 'number_11',
    type: 'number',
    level: 1,
    parentId: '0',
    seq: 9,
    props: {
      title: '数字输入框',
      name: '',
      precision: '',
      type: 'number',
      required: 'false',
      placeholder: '请输入数字',
      defaultValue: '',
      params: ''
    },
    events: []
  },
  {
    id: '0368d18b118568327a',
    name: 'select_13',
    type: 'select',
    level: 1,
    parentId: '0',
    seq: 10,
    props: {
      dataSourceType: '1',
      dataSource: '',
      title: '下拉框',
      name: '',
      radio: 'false',
      filterable: 'true',
      allCol: 'true',
      required: 'false',
      defaultValue: '',
      params: ''
    },
    events: []
  },
  {
    id: '9ab82a8ae7871830a9',
    name: 'date_12',
    type: 'date',
    level: 1,
    parentId: '0',
    seq: 11,
    props: {
      title: '日期',
      range: 'false',
      name: '',
      type: 'date',
      required: 'false',
      placeholder: '请选择日期',
      defaultValue: '',
      params: ''
    },
    events: []
  },
  {
    id: '321818831d89087a1e',
    name: 'fnsrmc_7',
    type: 'fnsrmc',
    level: 1,
    parentId: '0',
    seq: 12,
    props: {
      title: '纳税人名称',
      name: 'fnsrmc',
      type: 'text',
      required: 'false',
      placeholder: '请输入纳税人名称',
      defaultValue: '',
      params: ''
    },
    events: []
  },
  {
    id: 'db586b8f928b583e4b',
    name: 'button_6',
    type: 'button',
    level: 1,
    parentId: '0',
    seq: 13,
    props: {
      title: '查询',
      className: '',
      theme: '1',
      size: '',
      radius: 'false'
    },
    events: []
  }
]
