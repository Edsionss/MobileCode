import main from '@config/main.js'
const { bodyCanvas, componentLoader, utils, Vant } = main
const createAsyncComponent = componentLoader.createAsyncComponent
const bodyCanvasComponent = {
  name: 'bodyCanvasComponent',
  template: `<div>Loading...</div>`,
  components: {
    vuedraggable: window.vuedraggable //当前页面注册组件
  },
  data() {
    return {
      drag: false,
      schema: [],
      selectedComponentId: null
    }
  },
  created() {
    this.$root.$on('update-canvas-component-props', this.handleRootPropsUpdate);
    // Any other existing created hook logic
  },
  beforeDestroy() { // Assuming Vue 2 based on project structure
    this.$root.$off('update-canvas-component-props', this.handleRootPropsUpdate);
    // Any other existing beforeDestroy hook logic
  },
  watch: {},
  methods: {
    onStart(e) {
      this.drag = true
      console.log('onStart', e)
    },
    onEnd(e) {
      this.drag = false
      console.log('onEnd', e)
    },
    onClone(e) {
      console.log('onClone', e)
    },
    onAddItem(event) {
      console.log('onAddItem', event)
      console.log('Item added to schema:', this.schema);
      // Optional: Automatically select the newly added component
      // this.selectComponent(this.schema[event.newIndex]);
      this.selectedComponentId = this.schema[event.newIndex].id;
    },
    dragChange(item) {
      console.log('change', item)
    },
    selectComponent(component) {
      this.$emit('component-selected', component);
      this.selectedComponentId = component.id;
      // Optional: add some visual indication for selection on the canvas itself
      console.log('Selected component on canvas:', component);
    },
    handleRootPropsUpdate({ componentId, newProps }) {
      const componentIndex = this.schema.findIndex(c => c.id === componentId);
      if (componentIndex !== -1) {
        // Update the props of the specific component in the schema array
        // Vue.set is essential for adding reactive properties or updating array elements by index
        // For updating an existing object's property reactively:
        this.$set(this.schema[componentIndex], 'props', newProps);

        // Log for verification
        console.log('BodyCanvas schema updated for component ID:', componentId, this.schema[componentIndex]);
      }
    }
  }
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(bodyCanvasComponent, templateUrl, cssUrl)
