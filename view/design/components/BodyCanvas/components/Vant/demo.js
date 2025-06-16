// 在你的 VantCanvas 组件定义内部
const VantCanvas = {
  props: ['config'],
  template: `
    <div>
      <!-- 如果是简单按钮，直接渲染，不需要插槽 -->
      <div v-if="config.type === 'Button'">
        <button class="comp-button">{{ config.props.text }}</button>
      </div>

      <!-- 如果是卡片（我们的容器），它必须有一个插槽 -->
      <div v-if="config.type === 'Card'" class="comp-card">
        <div class="comp-card-header">{{ config.props.title }}</div>
        <div class="comp-card-body container-drop-zone">
          <!--
            ！！！魔力插槽！！！
            用于渲染子组件的 <NestedCanvas> 组件最终会被 Vue 渲染到这里。
          -->
          <slot></slot>
        </div>
      </div>
    </div>
  `
}
