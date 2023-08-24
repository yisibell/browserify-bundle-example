const path = require('path')
const browserify = require('browserify')
const { getEntryNames, getEntryBaseDir } = require('./util')
const fse = require('fs-extra')
const fs = require('fs')

const getVendorsPath = () => {
  return path.resolve(process.cwd(), 'dist/js/vendors/index.js')
}

const getPageJsPath = (pageName) => {
  return path.resolve(process.cwd(), 'dist/js/pages', `${pageName}.js`)
}

const getCommonsPath = () => {
  return path.resolve(process.cwd(), 'dist/js/commons/index.js')
}

const buildCommons = () => {
  const b = browserify()

  b.require('commons-lang')

  b.bundle((err, buf) => {
    if (err) {
      console.error(err);
      return
    }
    fse.ensureFileSync(getCommonsPath())
    fs.writeFileSync(getCommonsPath(), buf)
  })
}

const buildVendors = (externals = ['jquery']) => {
  const b = browserify()

  externals.forEach(pkg => {
    b.require(pkg)
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

const bundlePages = (pageName) => {
  const b = browserify()
  const entry = path.resolve(getEntryBaseDir(), `${pageName}.js`)
    
  console.log(entry);

  b.add(entry)
   .external('commons-lang')
   .external('jquery')
   .bundle((err, buf) => {
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