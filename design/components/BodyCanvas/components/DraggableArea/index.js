import main from '@config/main.js'; // Adjust path as needed
const { componentLoader } = main;
const createAsyncComponent = componentLoader.createAsyncComponent;

// Import the ComponentWrapper that DraggableArea will use
import ComponentWrapper from '../ComponentWrapper/index.js'; // Relative path to the new ComponentWrapper

const DraggableArea = {
  name: 'DraggableArea', // Recursive component must have name
  props: ['components', 'activeId', 'componentsMenu', 'clickMenuFn'],
  components: {
    'draggable': window.vuedraggable, // Assuming vuedraggable is globally available
    'component-wrapper': ComponentWrapper
  },
  template: '<div>Loading DraggableArea...</div>', // Placeholder for async loading
  methods: {
    isContainer: function(element) {
      return element.children && Array.isArray(element.children);
    },
    clickComponent: function(element) {
      this.$emit('component-clicked', element);
    },
    bubbleClick: function(element) { // To propagate click from nested DraggableArea
      this.$emit('component-clicked', element);
    }
  }
};

const templateUrl = new URL('index.html', import.meta.url).href;
// Assuming DraggableArea does not have its own separate CSS file.
export default createAsyncComponent(DraggableArea, templateUrl);
