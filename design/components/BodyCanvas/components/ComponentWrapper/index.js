import main from '@config/main.js'; // Or adjust path as needed to get createAsyncComponent
const { componentLoader } = main;
const createAsyncComponent = componentLoader.createAsyncComponent;

const ComponentWrapper = {
  name: 'ComponentWrapper', // Good practice to name components
  props: ['config', 'isSelected', 'componentsMenu', 'clickMenuFn'],
  template: '<div>Loading ComponentWrapper...</div>', // Placeholder, createAsyncComponent will load actual template
};

const templateUrl = new URL('index.html', import.meta.url).href;
// Assuming no separate CSS for ComponentWrapper for now
export default createAsyncComponent(ComponentWrapper, templateUrl);
