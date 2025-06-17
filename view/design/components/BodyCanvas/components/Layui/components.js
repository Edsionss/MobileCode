const layoutComponents = {
  card: {
    // 注意：容器组件必须包含 <slot></slot>
    template: `
      <div class="layui-card">
        <div class="layui-card-header">{{title||'卡片标题'}}</div>
        <div class="layui-card-body" style="min-height: 150px;">
        <div class="layui-children-content">
          <!-- 这里是魔力插槽 -->
          <slot></slot>
        </div>
        </div>
      </div>
    </div>
    `,
    props: ['title'] // 表单本身可能没有props
  },
  form: {
    template: `
      <form class="layui-form" lay-filter="form">
        <slot></slot>
      </form>
    `,
    props: []
  },
  grid: {
    template: `
      <div :class="gridRowClass">
        <div v-for="i in colsArray" :key="i" :class="gridColClass(i)">
          <div class="layui-children-content">
           <!-- 新增一层内容包裹，以避免间距影响 -->
            <slot :name="'col-slot-' + i"></slot>
          </div>
        </div>
      </div>
    `,
    computed: {
      colsArray() {
        const cols = this.config.props.cols || this.config.children.length || 2
        return Array.from({ length: cols }, (_, i) => i + 1)
      },
      gridRowClass() {
        const gap = this.config.props.gap
        let classes = ['layui-row']
        if (gap !== undefined && gap >= 0) {
          // LayUI 的间距 class 是 layui-col-spaceN
          classes.push(`layui-col-space${gap}`)
        }
        return classes
      }
    },
    methods: {
      gridColClass(i) {
        const cols = this.config.props.cols || 2
        // 计算每列应该占的栅格数
        let span = Math.floor(12 / cols)
        // 处理无法均分的情况，例如 7 列，将余数加到前面的列上
        const remainder = 12 % cols
        if (i <= remainder) {
          span += 1
        }
        // 拼接 LayUI 的栅格 Class，例如 'layui-col-md6'
        // 未来可以从 config.props 中读取响应式断点，如 'xs', 'sm', 'lg'
        const breakpoint = this.config.props.mode || 'md'
        return ['layui-col', `layui-col-${breakpoint}${span}`]
      }
    },
    props: ['config']
  },
  xmSelect: {
    template: `
      <div class="layui-form-item">
        <label class="layui-form-label">{{config.props.label}}</label>
        <div class="layui-input-block">
          <div :id="config.id"></div>
        </div>
      </div>
    `,
    props: ['config'],
    mounted() {
      this.$nextTick(() => {
        let config = this.config,
          props = this.config.props
        // 确保 xmSelect 已经加载
        var xmSelectInit = xmSelect.render({
          el: '#' + config.id,
          data: props.options || []
        })
      })
    }
  },
  table: {
    template: `
    <div style=""> 
      <table class="layui-hide" :id="config.id" :lay-filter="config.id"></table>
    </div>
    `,
    props: ['config'],
    mounted() {
      this.$nextTick(() => {
        let props = this.config.props,
          id = this.config.id
        var table = layui.table
        // 渲染，并获得实例对象
        var inst = table.render({
          ...props,
          elem: '#' + id, // 绑定元素选择器
          cols: props.cols || [
            [
              { type: 'checkbox', fixed: 'left' },
              { field: 'id', fixed: 'left', width: 80, title: 'ID', sort: true, totalRow: '合计：' },
              { field: 'username', width: 80, title: '用户' },
              { field: 'sex', width: 80, title: '性别', sort: true },
              { field: 'experience', width: 100, title: '积分', sort: true, totalRow: '{{= d.TOTAL_NUMS }} 😊' },
              { field: 'ip', title: 'IP', width: 120 },
              { field: 'joinTime', title: '加入时间', width: 120 }
            ]
          ],
          data: props.data || [
            {
              id: 100001,
              username: '用户1',
              sex: '男',
              experience: 100,
              ip: '192.168.1.1',
              joinTime: '2021-01-01 12:00:00'
            },
            {
              id: 100002,
              username: '用户2',
              sex: '女',
              experience: 200,
              ip: '192.168.1.2',
              joinTime: '2021-01-02 12:00:00'
            }
          ],
          // toolbar: true,
          // cellMinWidth: 80,
          // totalRow: true, // 开启合计行
          // page: true,
          // defaultToolbar: ['filter', 'exports'],
          // height: '400px',
          // url: '',
          done: function (res, curr, count, origin) {
            props.done && props.done(res, curr, count, origin)
          }
          // 其他属性
          // …
        })
      })
    }
  },
  echarts: {
    template: `
    <div> 
      <div :style="chartStyle" :id="config.id" :lay-filter="config.id"></div>
    </div>
    `,
    props: ['config'],
    created() {},
    mounted() {
      this.render()
    },
    methods: {
      render() {
        var chartDom = document.getElementById(this.config.id)
        var myChart = echarts.init(chartDom)
        let type = this.config.props.chantType,
          option
        switch (type) {
          case 'echartsBarLine':
            option = this.echartsBarLine()
            break
          case 'echartsPie':
            option = this.echartsPie()
            break
          default:
            break
        }
        // console.log(option)

        option && myChart.setOption(option)
      },
      echartsBarLine() {
        return {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [120, 200, 150, 80, 70, 110, 130],
              type: 'bar'
            }
          ]
        }
      },
      echartsPie() {
        return {
          title: {
            text: 'Referer of a Website',
            subtext: 'Fake Data',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: '50%',
              data: [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union Ads' },
                { value: 300, name: 'Video Ads' }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      }
    },
    computed: {
      chartStyle() {
        return { width: ' 100%', height: this.config.height || '500px' }
      }
    }
  }
}
const registeredComponents = {}
// 将组件名映射为 layui 组件名
for (const key in layoutComponents) {
  let item = layoutComponents[key]
  registeredComponents['lay-' + key] = item
}
console.log('[lay] 注册组件：', registeredComponents)

export default registeredComponents
