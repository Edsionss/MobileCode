import utils from '@utils/index.js'
const { generateUniqueId, exportToFile } = utils
export default {
  titleList: [
    {
      label: 'Stitcher'
    }
  ],
  modeList: [
    {
      label: 'PC',
      icon: '../../../assets/icon/svg/computer.svg',
      style: {
        //暂不做特定要求
        width: 'calc((100% - 752px) - 60px)',
        left: 'calc(350px + 30px)',
        height: 'calc(100% - 40px)'
      }
    },
    {
      label: 'Phone',
      icon: '../../../assets/icon/svg/phone.svg',
      style: {
        //iphone12 pro  的分辨率
        width: '390px',
        height: '844px',
        left: 'calc(350px + ((100% - 752px) - 390px) / 2)'
      }
    },
    {
      label: 'Pad',
      icon: '../../../assets/icon/svg/pad.svg',
      style: {
        //ipad mini的分辨率768 * 1024
        width: '768px',
        height: '1024px',
        left: 'calc(350px + ((100% - 752px) - 768px) / 2)'
      }
    }
  ],
  defaultMode: 'Phone',
  buttonList: [
    {
      label: '重置',
      type: 'info',
      icon: 'el-icon-refresh-left'
    },
    {
      label: '保存',
      type: 'success',
      icon: 'el-icon-document-checked'
    },
    {
      label: '预览',
      type: 'primary',
      icon: 'el-icon-view',
      click() {
        console.log(this.$store.state)
        // window.open(`/view/preview/index.html?id=${generateUniqueId()}`, '_blank')
        // 1. 定义你想要跳转的路由信息
        const routeData = this.$router.resolve({
          name: 'preview', // 路由的name
          params: { userId: '123' }, // 路由参数
          query: { source: 'dashboard' } // 查询参数
        })

        // 2. 使用 window.open 打开 resolve 生成的 href
        //    第二个参数 '_blank' 表示在新标签页中打开
        window.open(routeData.href, '_blank')
      }
    },
    {
      label: '导出',
      type: 'warning',
      icon: 'el-icon-download',
      click() {
        console.log(this.$store.state)
        let data = _.cloneDeep(this.$store.state.componentsList)
        exportToFile(data, 'page.js')
      }
    }
  ],
  defaultVersionLabel: 'Beta',
  version: '0.1.7',
  icon: '../../../assets/icon/svg/Stitcher.svg'
}
