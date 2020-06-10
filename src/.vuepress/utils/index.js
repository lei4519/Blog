const path = require('path')
const fs = require('fs')
function genSliderBar() {
  const basePath = path.resolve(__dirname, '..', '..')
  const noParse = ['README.md', 'img']
  const _readdir = (path, arr, depth) => {
    const dirsOrFiles = fs.readdirSync(basePath + path)
    dirsOrFiles.forEach(name => {
      if (name.indexOf('.') === 0) return
      if (noParse.includes(name)) return
      const stat = fs.statSync(basePath + path + name)
      if (stat.isDirectory()) {
        const rawChildren = _readdir(path + name + '/', [], depth + 1)
        const sortChildren = mergeSort(rawChildren, (a, b) => {
          if (!b.mtime) return true
          return a.mtime < b.mtime
        })
        const group = {
          title: name,
          sidebarDepth: depth,
          children: sortChildren.map(item => item.path ? item.path : item)
        }
        arr.push(group)
      } else {
        arr.push({
          path: path + name,
          mtime: stat.mtime
        })
      }
    })
    return arr
  }
  return _readdir('/', [], 1)
}
function mergeSort (array, fn) {
  if (!fn || typeof fn !== 'function') fn = (a, b) => a > b
  // 分
  const divide = (arr) => {
    const len = arr.length
    if (len < 2) return arr
    const mid = len / 2 | 0
    return merge(divide(arr.slice(0, mid)), divide(arr.slice(mid)))
  }
  // 合
  const merge = (a1, a2) => {
    const a = []
    while (a1.length && a2.length) {
      a.push(fn(a1[0], a2[0])
        ? a2.shift()
        : a1.shift()
        )
    }
    return a.concat(a1, a2)
  }
  return divide(array)
}

module.exports = {
  genSliderBar
}
