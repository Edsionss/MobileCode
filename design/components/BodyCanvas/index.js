import main from '@config/main.js';
// Import the new HTML templates
import draggableAreaTemplate from './draggable-area-template.html';
import componentWrapperTemplate from './component-wrapper-template.html';

const { bodyCanvas, componentLoader, utils, Vant } = main; // Keep Vant if it's used by ComponentWrapper or specific components
const createAsyncComponent = componentLoader.createAsyncComponent;

// Removed old canvas component imports (LayuiCanvas, VantCanvas) as ComponentWrapper will handle rendering.
// Vue.component('layui-canvas', LayuiCanvas);
// Vue.component('vant-canvas', VantCanvas);

// Define ComponentWrapper
const ComponentWrapper = {
  template: componentWrapperTemplate, // Use imported template
  props: ['config'],
  // Add any methods or computed properties needed by ComponentWrapper here
  // For example, if the component menu needs to be rendered here:
  // data() { return { menu: main.bodyCanvas.menu }; }, // Assuming bodyCanvas is accessible
  // methods: { handleMenuClick(action, componentConfig) { ... } }
};

// Define DraggableArea
const DraggableArea = {
  name: 'DraggableArea', // Recursive component must have name
  template: draggableAreaTemplate, // Use imported template
  props: ['components', 'activeId'],
  components: {
    'draggable': window.vuedraggable,
    'component-wrapper': ComponentWrapper // Register ComponentWrapper
  },
  methods: {
    isContainer: function(element) {
      return element.children && Array.isArray(element.children);
    },
    clickComponent: function(element) {
      this.$emit('component-clicked', element);
    },
    // bubbleClick is used to propagate the event from nested draggable-areas
    bubbleClick: function(element) {
      this.$emit('component-clicked', element);
    }
  }
};

const bodyCanvasComponent = {
  name: 'bodyCanvasComponent',
  template: `<div>Loading...</div>`, // This will be replaced by the async loader with index.html content
  components: {
    // Register DraggableArea, vuedraggable is globally available or loaded via script tag
    'draggable-area': DraggableArea,
    'draggable': window.vuedraggable // Ensure vuedraggable is available
  },
  data() {
    return {
      // Renamed dragComponents to canvasComponents and initialized as empty array
      canvasComponents: [],
      // Initialized activeComponentId to null
      activeComponentId: null,
      componentsMenu: bodyCanvas.menu // Keep componentsMenu for now
    };
  },
  computed: {
    ...Vuex.mapState(['componentAttr'])
  },
  watch: {
    componentAttr: {
      handler(newVal) {
        // console.log('componentAttr changed:', newVal);
        // Logic to update props in canvasComponents if needed, assuming structure matches
        // This might need adjustment based on how props are structured in the new vs old system
        this.canvasComponents.forEach(component => {
          if (component.id === newVal.componentId) {
            // Ensure the props structure is compatible.
            // The new system has props within a 'props' object (e.g., element.props.text)
            // The old system might have had them differently.
            // This assumes newVal.props is an object that can be assigned.
            component.props = { ...component.props, ...newVal.props };
          }
        });
      },
      deep: true
    }
  },
  methods: {
    // Updated onComponentClick method
    onComponentClick: function(element) {
      console.log('Component clicked:', element.id, element); // Original log: '你他妈的终于点中了:'
      this.activeComponentId = element.id;
      // If interaction with Vuex store is needed:
      // this.$store.commit('setComponentConfig', element);
    },

    // Keep clickMenu if it's still relevant and potentially adapt its usage
    // This method was originally called from the old template.
    // It needs to be callable from the new structure, perhaps by passing it to ComponentWrapper.
    clickMenu(item, config) {
      // The `this` context for `item.click` needs to be correct.
      // It was bound to the bodyCanvasComponent instance.
      // If `item.click` is defined in `config/components/bodyCanvas.js`
      // and expects `this` to be `bodyCanvasComponent`, this should still work
      // if `clickMenu` is called correctly from the new template structure.
      if (item.click && typeof item.click === 'function') {
        item.click.call(this, config); // Explicitly set `this`
      }
    }
    // Removed onStart, onEnd, onClone, onAddItem, dragChange, getComponentName
    // clickComponents is replaced by onComponentClick
  }
};

const templateUrl = new URL('index.html', import.meta.url).href;
const cssUrl = new URL('index.css', import.meta.url).href;
export default createAsyncComponent(bodyCanvasComponent, templateUrl, cssUrl);
