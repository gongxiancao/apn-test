var push = require('./index.js');

var loops = 10;
var tries = 0;

function test () {
  if(++tries > loops) {
    process.exit(0);
    return;
  }
  var message = 'hello_' + Math.random() + ': ' + tries;
  console.log('sending message: ' + message);
  push(
    'xxxx', //cert
    'xxxx', //key
    'Vp9/v2NaM4iXJgJeMYuR6MJ55QS0kfU0WPBfE9SrlfY=', //token
    message
    );
  setTimeout(function () {
    test();
  },
  4000);  
}

test();
