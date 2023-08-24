const $ = require('jquery')

const hello = () => {
  console.log('about:', $);
}

hello()

module.exports = {
  hello
}