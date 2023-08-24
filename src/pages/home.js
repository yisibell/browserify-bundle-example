const $ = require('jquery')

require('commons-lang')

const hello = () => {
  console.log('home:', $);
  $('#app').html('Hello, home!')
}

hello()

module.exports = {
  hello
}