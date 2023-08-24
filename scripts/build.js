const path = require('path')
const browserify = require('browserify')
const { getEntryNames, getEntryBaseDir } = require('./util')
const fse = require('fs-extra')
const fs = require('fs')

// 外部依赖
const externals = ['jquery']

const getVendorsPath = () => {
  return path.resolve(process.cwd(), 'dist/js/vendors/index.js')
}

const getPageJsPath = (pageName) => {
  return path.resolve(process.cwd(), 'dist/js/pages', `${pageName}.js`)
}

const getCommonsPath = () => {
  return path.resolve(process.cwd(), 'dist/js/commons/index.js')
}

// 构建自定义模块
const buildCommons = () => {
  const commonModuleNames = getEntryNames('src/commons')

  const b = browserify()

  commonModuleNames.forEach(name => {
    b.require(path.resolve(process.cwd(), `src/commons/${name}.js`), {
      expose: `commons-${name}` // 自定义模块名
    })
  })


  b.bundle((err, buf) => {
    if (err) {
      console.error(err);
      return
    }
    fse.ensureFileSync(getCommonsPath())
    fs.writeFileSync(getCommonsPath(), buf)
  })
}

// 构建第三方模块
const buildVendors = () => {
  const b = browserify()

  externals.forEach(name => {
    b.require(name)
  })

  b.bundle((err, buf) => {
    if (err) {
      console.error(err);
      return
    }
    fse.ensureFileSync(getVendorsPath())
    fs.writeFileSync(getVendorsPath(), buf)
  })
}

// 构建页面入口
const bundlePages = (pageName) => {
  const b = browserify()
  const entry = path.resolve(getEntryBaseDir(), `${pageName}.js`)
  const commonModuleNames = getEntryNames('src/commons')
  
  console.log(entry);

  b.add(entry)

  commonModuleNames.forEach(name => {
    b.external(`commons-${name}`)
  })

  externals.forEach(name => {
    b.external(name)
  })

  b.bundle((err, buf) => {
  if (err) {
    console.error(err);
    return
  }
  
  fse.ensureFileSync(getPageJsPath(pageName))
  fs.writeFileSync(getPageJsPath(pageName), buf)
  
})
}

const run = () => {

  buildVendors()

  buildCommons()

  const entries = getEntryNames()

  entries.forEach(pageName => {

    bundlePages(pageName)
    
  })


}

run()