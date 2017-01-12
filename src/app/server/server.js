var phantomjs = require('phantomjs-prebuilt');
var program = phantomjs.exec('phantomjs-script.js', 'http://www.2737499.cn');
program.stdout.pipe(process.stdout);
program.stderr.pipe(process.stderr);
program.on('exit', function (code) {
    // do something on end 
});
