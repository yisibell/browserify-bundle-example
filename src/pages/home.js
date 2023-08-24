const $ = require('jquery')

const lang = require('commons-lang')
const foo = require('commons-foo')

const hello = () => {
  console.log('home:', $);
  $('#app').html('Hello, home!')
}

lang()
foo()

hello()

module.exports = {
  hello
}