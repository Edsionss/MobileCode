import data from '../view/preview/testdata.js'
class Transition {
  constructor(pageInfo) {
    const { modules } = pageInfo
    this.pageInfo = pageInfo
    this.allComponents = this.getTiledComponents(modules)
    this.componentsDict = {
      fnsrsbh: data => {
        const { props, events } = data,
          { title, name, type, required, placeholder, defaultValue, params } = props,
          newProps = {
            label: title,
            valueName: name,
            required,
            placeholder,
            defaultValue,
            params
          },
          tag = 'wd-input',
          valueName = 'inputValue'
        return {
          tag,
          valueName,
          props: newProps,
          events: events
        }
      },
      fnsrmc: data => {
        const { props, events } = data,
          { title, name, type, required, placeholder, defaultValue, params } = props,
          newProps = {
            label: title,
            valueName: name,
            required,
            placeholder,
            defaultValue,
            params
          },
          tag = 'wd-input',
          valueName = 'inputValue'
        return {
          tag,
          valueName,
          props: newProps,
          events: events
        }
      },
      frkrq: data => {
        const { props, events } = data,
          { title, name, type, required, placeholder, defaultValue, params } = props,
          newProps = {
            label: title,
            valueName: name,
            required,
            placeholder,
            defaultValue,
            params
          },
          tag = 'wd-calendar ',
          valueName = 'dateValue'
        return {
          tag,
          valueName,
          props: newProps,
          events: events
        }
      },
      input: data => {
        const { props, events } = data,
          { title, name, type, required, placeholder, defaultValue, params } = props,
          newProps = {
            label: title,
            valueName: name,
            required,
            placeholder,
            defaultValue,
            params
          },
          tag = 'wd-input',
          valueName = 'inputValue'
        return {
          tag,
          valueName,
          props: newProps,
          events: events
        }
      },
      number: data => {
        const { props, events } = data,
          { title, name, type, required, placeholder, defaultValue, params } = props,
          newProps = {
            label: title,
            valueName: name,
            type: 'number',
            required,
            placeholder,
            defaultValue,
            params
          },
          tag = 'wd-input',
          valueName = 'inputValue'
        return {
          tag,
          valueName,
          props: newProps,
          events: events
        }
      },
      date: data => {
        const { props, events } = data,
          { title, name, type, required, placeholder, defaultValue, params } = props,
          newProps = {
            label: title,
            valueName: name,
            required,
            placeholder,
            defaultValue,
            params
          },
          tag = 'wd-calendar ',
          valueName = 'dateValue'
        return {
          tag,
          valueName,
          props: newProps,
          events: events
        }
      },
      select: data => {
        const { props, events } = data,
          { title, name, type, required, placeholder, defaultValue, params, radio } = props,
          newProps = {
            label: title,
            valueName: name,
            required,
            placeholder,
            defaultValue,
            type: radio ? 'radio' : 'checkbox',
            columns: [
              {
                value: '101',
                label: '男装'
              },
              {
                value: '102',
                label: '奢侈品'
              },
              {
                value: '103',
                label: '女装'
              }
            ],
            params
          },
          tag = 'wd-select-picker'
        return {
          tag,
          valueName: name,
          props: newProps,
          events: events
        }
      },
      button: data => {
        const { props, events } = data,
          { title, name, type, required, placeholder, defaultValue, params, radio } = props,
          newProps = {
            label: title,
            valueName: name,
            required,
            placeholder,
            params
          },
          tag = 'wd-select-picker'
        return {
          tag,
          props: newProps,
          events: events,
          click: () => {}
        }
      }
    }
    this.componentsList = modules || []
    this.componentsConfig = this.getComponents(this.componentsDict, this.allComponents)
    console.log(this.componentsConfig)

    this.formComponents = []
    this.tableComponents = []
    this.echartsComponents = []
  }
  //
  getTiledComponents(array) {
    let result = []
    const recursionFun = array => {
      array.forEach(item => {
        const { children, ...node } = item
        result.push(node)
        if (children && children.length) {
          recursionFun(children)
        }
      })
    }
    recursionFun(array)
    return result
  }
  // 获取组件
  getComponents(dict, componentsList) {
    let result = { form: [], table: [], echarts: [] }
    componentsList.forEach(item => {
      let { type: componentTag } = item
      if (dict[componentTag]) {
        switch (componentTag) {
          case 'table':
            result.table.push(dict[componentTag](item))
            break
          case 'echarts':
            result.echarts.push(dict[componentTag](item))
            break
          default:
            result.form.push({ ...dict[componentTag](item), framework: 'wot', groupName: 'form' })
            break
        }
      } else {
        console.error(`[Wot] 组件 ${item.type} 暂时未添加`)
      }
    })
    return result
  }
  assemblyJSON() {}
}
const transition = new Transition(data)
export default transition
