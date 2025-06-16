class Transition {
  constructor(pageInfo) {
    const { modules } = pageInfo
    this.pageInfo = pageInfo
    this.allComponents = this.getTiledComponents(modules)
    this.formDict = { fnsrsbh: {}, fnsrmc: {}, frkrq: {}, input: {}, number: {}, date: {}, select: {}, button: {} }
    this.components = modules || []
    this.formComponents = []
    this.tableComponents = []
    this.echartsComponents = []
  }
  getTiledComponents() {
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
  getComponents(dict, componentsList) {}
}
