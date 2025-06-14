# 移动端低代码设计器

## 项目简介

这是一个基于 Vue.js 的移动端低代码设计器项目，提供了可视化的组件拖拽、属性配置等功能，帮助开发者快速构建移动端页面。

## 技术栈

- **前端框架**: Vue.js
- **UI 组件库**:
  - Element UI
  - Vant UI
  - WotDesign
  - Layui
- **状态管理**: Vuex
- **路由管理**: Vue Router
- **工具库**:
  - Lodash
  - Sortable.js
  - Vuedraggable
  - ECharts 5.6
- **其他依赖**:
  - xm-select
  - contextmenu
  - es-module-shims

## 项目结构

```
├── assets/                    # 静态资源文件
│   ├── images/               # 图片资源
│   │   ├── logo/            # Logo图片
│   │   └── backgrounds/     # 背景图片
│   ├── icons/                # 图标资源
│   │   ├── svg/             # SVG图标
│   │   └── png/             # PNG图标
│   └── styles/               # 全局样式文件
│       ├── variables.less    # 样式变量
│       ├── mixins.less      # 样式混入
│       └── common.less      # 通用样式
│
├── config/                    # 配置文件
│   ├── main.js               # 主配置文件
│   ├── components/           # 组件配置
│   │   ├── AttributeForm/    # 属性表单配置
│   │   ├── module/          # 模块配置
│   │   ├── header.js        # 头部配置
│   │   ├── componentsMenu.js # 组件菜单配置
│   │   ├── rightAttribute.js # 右侧属性配置
│   │   ├── help.js          # 帮助配置
│   │   ├── leftModules.js   # 左侧模块配置
│   │   ├── template.js      # 模板配置
│   │   └── dataSource.js    # 数据源配置
│   └── global/              # 全局配置
│       └── index.js         # 全局配置入口
│
├── design/                    # 设计器相关代码
│   ├── main/                 # 主设计器页面
│   │   ├── index.html        # 主页面HTML
│   │   ├── index.js          # 主页面逻辑
│   │   ├── index.css         # 主页面样式
│   │   ├── preview.html      # 预览页面HTML
│   │   └── preview.js        # 预览页面逻辑
│   ├── preview/              # 预览相关代码
│   ├── backup/               # 备份文件
│   └── components/           # 设计器组件
│       ├── Header/           # 头部组件
│       ├── LeftModules/      # 左侧模块面板
│       ├── BodyCanvas/       # 画布组件
│       ├── RightAttribute/   # 右侧属性面板
│       └── CanvasError/      # 画布错误提示
│
├── modules/                   # 功能模块
│   ├── components/           # 业务组件
│   └── store/               # Vuex状态管理
│
├── package/                   # 第三方依赖包
│   ├── Vue/                  # Vue相关
│   ├── Vuex/                # Vuex状态管理
│   ├── Router/              # Vue Router
│   ├── ElementUI/           # Element UI
│   ├── Vant/                # Vant UI
│   ├── WotDesign/           # WotDesign
│   ├── Layui/               # Layui
│   ├── Echarts/             # ECharts
│   ├── Lodash/              # Lodash工具库
│   ├── Sortable/            # Sortable.js
│   ├── Vuedraggable/        # Vuedraggable
│   ├── ContextMenu/         # 右键菜单
│   ├── XmSelect/            # xm-select
│   └── EsModule/            # ES模块支持
│
├── utils/                     # 工具函数
│
├── .vscode/                   # VS Code配置
│
├── index.html                 # 项目入口HTML
├── package.json              # 项目依赖配置
├── README.md                 # 项目说明文档
└── .gitignore                # Git忽略文件
```

## 主要功能

1. 组件拖拽设计
2. 属性面板配置
3. 模块化管理
4. 画布编辑
5. 错误提示

## 开发环境要求

- Node.js
- 现代浏览器（支持 ES6+）

## 快速开始

1. 克隆项目

```bash
git clone [项目地址]
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run dev
```

## 项目特点

- 支持多种 UI 组件库
- 可视化拖拽设计
- 实时属性配置
- 模块化架构
- 完善的错误处理

## 注意事项

- 确保所有依赖包版本兼容
- 遵循项目的代码规范
- 注意浏览器兼容性

## 贡献指南

欢迎提交 Issue 和 Pull Request

## 许可证

[待补充]
