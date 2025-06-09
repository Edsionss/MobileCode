import utils from '@utils/index.js'
import global from './global/index.js'
import header from './components/header.js'
import bodyCanvas from './components/bodyCanvas.js'
import leftModules from './components/leftModules.js'
import componentModule from './components/componentModule.js'
import dataSource from './components/dataSource.js'
import help from './components/help.js'
import template from './components/template.js'
import rightAttribute from './components/rightAttribute.js'
import componentsAttrForm from './base/componentsAttrForm.js'
import componentLoader from '../utils/componentLoader.js'
import Element from '@/modules/components/Element.js'
import Vant from '@/modules/components/Vant.js'
const config = {
  header,
  bodyCanvas,
  leftModules,
  rightAttribute,
  componentsAttrForm,
  componentLoader,
  Element,
  Vant,
  global,
  componentModule,
  dataSource,
  help,
  template,
  utils
}
for (const key in config) {
  let data = config[key]
  config[key] = utils.generateDataId(data)
}
console.log(config)

export default config
