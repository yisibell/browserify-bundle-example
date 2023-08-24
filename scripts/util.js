const fs = require('fs')
const path = require('path')

const getEntryBaseDir = (targetDirName = 'src/pages') => {
  return path.resolve(process.cwd(), targetDirName)
}

module.exports = {
  getEntryBaseDir,
  /**
   * 获取入口列表
   * @param {string} targetDirName 目标文件夹名称
   * @returns {string[]} 名称数组
   */
  getEntryNames(targetDirName = 'src/pages') {
    const basePath = getEntryBaseDir(targetDirName)
    const arr = fs.readdirSync(basePath)

    return arr.map(v => v.replace('.js', ''))
  },
}