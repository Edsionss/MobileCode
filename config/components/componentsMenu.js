export default {
  menu: [
    {
      label: '删除',
      icon: 'el-icon-close',
      click: function (item, config, componentsList) {
        this.$confirm('是否继续删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            componentsList.forEach((item, index) => {
              if (item.id == config.id) {
                componentsList.splice(index, 1)
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    }
    // {
    //   label: '删除',
    //   icon: 'el-icon-delete',
    //   click: config => {
    //     this.dragComponents.array.forEach(item, index => {
    //       if (item.id == config.id) {
    //         components.splice(index, 1)
    //       }
    //     })
    //   }
    // }
  ]
}
