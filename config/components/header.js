export default {
  titleList: [
    {
      label: 'Stitcher'
    }
  ],
  modeList: [
    {
      label: 'PC',
      icon: '../../assets/icon/svg/computer.svg',
      style: {
        //暂不做特定要求
        width: 'calc((100% - 752px) - 60px)',
        left: 'calc(350px + 30px)',
        height: 'calc(100% - 40px)'
      }
    },
    {
      label: 'Phone',
      icon: '../../assets/icon/svg/phone.svg',
      style: {
        //iphone12 pro  的分辨率
        width: '390px',
        height: '844px',
        left: 'calc(350px + ((100% - 752px) - 390px) / 2)'
      }
    },
    {
      label: 'Pad',
      icon: '../../assets/icon/svg/pad.svg',
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
      icon: 'el-icon-view'
    },
    {
      label: '导出',
      type: 'warning',
      icon: 'el-icon-download',
      click() {
        console.log(this.$store.state)
      }
    }
  ],
  defaultVersionLabel: 'Beta',
  version: '0.1.7',
  icon: '../../assets/icon/svg/Stitcher.svg'
}
