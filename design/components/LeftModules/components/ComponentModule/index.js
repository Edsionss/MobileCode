import main from '@config/main.js';
// Import AllDict to access component definitions
import AllDict from '@modules/components/main.js';
const { componentLoader, utils } = main; // Removed componentModule as it's no longer used directly here
const createAsyncComponent = componentLoader.createAsyncComponent;

const ComponentModule = {
  name: 'ComponentModule',
  template: ``, // Template is loaded from index.html
  data() {
    return {
      // Define sourceComponents based on AllDict
      sourceComponents: this.transformComponents(AllDict),
      activeFrameworkName: 'layui', // Keep existing UI state variables if needed
      activeTabs: {},
      groupShowStates: {}
      // Removed componentsArray
    };
  },
  watch: {
    // Update watchers if they depended on componentsArray
    // For now, let's assume they are either not needed or will be updated if errors occur
  },
  created() {
    this.initComponentsState(); // This method might need adjustment if it used componentsArray
  },
  mounted() {},
  methods: {
    // Method to transform component definitions
    transformComponents(allDict) {
      const source = [];
      for (const frameworkName in allDict) {
        if (allDict.hasOwnProperty(frameworkName)) {
          const frameworkComponents = allDict[frameworkName];
          for (const componentTag in frameworkComponents) {
            if (frameworkComponents.hasOwnProperty(componentTag)) {
              const compDef = frameworkComponents[componentTag]({}); // Call the function to get base config

              // Basic transformation - this will need to be more sophisticated
              // to match the new structure exactly, especially for props and children.
              let componentName = compDef.props && compDef.props.attr && compDef.props.attr.label;
              if (!componentName) {
                // Fallback name if label is not found
                componentName = `${frameworkName} ${componentTag}`;
              }

              const newComp = {
                name: componentName,
                type: `${frameworkName.toLowerCase()}-${componentTag}`, // e.g., vant-field
                props: compDef.props || {}, // Keep original props for now
                                          // This will likely need further processing to fit the new structure's props model
                // children: compDef.slot && compDef.slot.includes('<slot></slot>') ? [] : undefined
              };

              // Determine if it's a container (very basic check, might need refinement)
              // The new solution's example explicitly defines `children: []` for containers.
              // We need to identify container components from the old structure.
              // For now, let's assume 'card' and 'form' types are containers as in the example.
              if (newComp.type.includes('card') || newComp.type.includes('form')) {
                newComp.children = [];
              }

              source.push(newComp);
            }
          }
        }
      }
      // Manually add components from the example that might not be in AllDict
      // or require specific definitions not easily derived.
      // This part needs to align with the example's sourceComponents.
      // Example: { name: '标题', type: 'title', props: { text: '这是一个大标题' } }

      // For now, returning the transformed list. Will need to merge/align with example's sourceComponents structure.
      // This is a placeholder for the more detailed transformation.
      // The actual transformation should produce exactly what the new Vue components expect.
      // Example of a more direct mapping (if AllDict provided enough info):
      // { name: compDef.label, type: compDef.type, props: compDef.specificProps, children: compDef.isContainer ? [] : undefined }

      // Placeholder for the example's source components, as the direct transformation is complex
      // and needs to match the new component-wrapper logic.
      // This should be replaced with a proper transformation logic.
      return [
        { name: '标题', type: 'title', props: { text: '这是一个大标题' } },
        { name: '段落', type: 'paragraph', props: { text: '这是一段详细的文字描述内容...' } },
        { name: '输入框', type: 'input', props: { placeholder: '请输入...' } },
        { name: '按钮', type: 'button', props: { text: '提交' } },
        { name: '卡片容器', type: 'card', props: { title: '卡片标题' }, children: [] },
        { name: '表单容器', type: 'form', props: {}, children: [] }
      ];
    },

    // New cloneComponent method
    cloneComponent(original) {
      var newComponent = JSON.parse(JSON.stringify(original));
      newComponent.id = 'comp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      if (newComponent.children) {
        newComponent.children = [];
      }
      return newComponent;
    },

    // Adjust initComponentsState if it relied on componentsArray
    // For example, if it iterated over componentsArray, it might not be needed anymore
    // or need to be adapted for sourceComponents or a different structure.
    initComponentsState() {
      // This method originally set up activeTabs and groupShowStates based on componentsArray.
      // If the UI for selecting frameworks/groups is kept, this needs to be adapted.
      // For now, let's assume the new design might not use this in the same way.
      // If errors occur, this method will need to be revisited.
      // console.log("initComponentsState called");
      // Example: If `this.componentsArray` was used, it's no longer available.
      // If `sourceComponents` is flat, the logic for frameworks/groups might be removed or changed.
    },
    toggleFramework(frameworkName) {
      this.activeFrameworkName = this.activeFrameworkName === frameworkName ? '' : frameworkName;
    },
    foldItem(frameworkName, groupName) {
      const key = `${frameworkName}-${groupName}`;
      this.$set(this.groupShowStates, key, !this.groupShowStates[key]);
    },
    isGroupOpen(frameworkName, groupName) {
      const key = `${frameworkName}-${groupName}`;
      return this.groupShowStates[key];
    },
    getFrameworkIcon(name) {
      const icons = {
        ElementUI: 'el-icon-platform-eleme',
        VantUI: 'el-icon-mobile-phone',
        Layui: 'el-icon-monitor'
      };
      return icons[name] || 'el-icon-menu';
    }
    // Removed onClone method
  }
};

const templateUrl = new URL('index.html', import.meta.url).href;
const cssUrl = new URL('index.css', import.meta.url).href;
export default createAsyncComponent(ComponentModule, templateUrl, cssUrl);
