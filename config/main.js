import utils from '@utils/index.js'
import global from './global/index.js'
import header from './components/header.js'
import bodyCanvas from './components/bodyCanvas.js'
import leftModules from './components/leftModules.js'
import vantModule from './components/vantModule.js'
import dataSource from './components/dataSource.js'
import help from './components/help.js'
import template from './components/template.js'
import rightAttribute from './components/rightAttribute.js'
import vantAttrForm from './base/AttributeForm/vant/attrForm.js'
import componentLoader from '../utils/componentLoader.js'
import componentsDict from '@modules/components/main.js'
const config = {
  header,
  bodyCanvas,
  leftModules,
  rightAttribute,
  componentsAttrForm: {
    vant: utils.processComponentAttrConfig(vantAttrForm, componentsDict.Element)
  },
  componentLoader,
  Element: componentsDict.Element,
  Vant: componentsDict.Vant,
  WotDesign: componentsDict.WotDesign,
  global,
  vantModule: vantModule,
  dataSource,
  help,
  template,
  utils
}
for (const key in config) {
  let data = config[key]
  config[key] = utils.generateDataId(data)
}
console.log('config', config)

export default config
