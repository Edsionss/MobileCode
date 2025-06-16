import utils from '@utils/index.js'
import global from './global/index.js'
import header from './components/header.js'
import leftModules from './components/leftModules.js'
// import vantModule from './components/vantModule.js'
import componentModule from './components/module/main.js'
import dataSource from './components/dataSource.js'
import help from './components/help.js'
import template from './components/template.js'
import rightAttribute from './components/rightAttribute.js'
import vantAttrForm from './components/AttributeForm/vant/index.js'
import layuiAttrForm from './components/AttributeForm/layui/index.js'
import createAsyncComponent from '../utils/componentLoader.js'
import { Element, Vant, Wot, Layui } from '@modules/components/main.js'
import componentsMenu from './components/componentsMenu.js'
const config = {
  header,
  leftModules,
  rightAttribute,
  componentsAttrForm: {
    vant: utils.processComponentAttrConfig(vantAttrForm, Element),
    layui: utils.processComponentAttrConfig(layuiAttrForm, Element)
  },
  createAsyncComponent,
  Element,
  Vant,
  Wot,
  Layui,
  global,
  componentModule,
  dataSource,
  help,
  template,
  componentsMenu,
  utils
}
for (const key in config) {
  let data = config[key]
  config[key] = utils.generateDataId(data)
}
console.log('config', config)

export default config
