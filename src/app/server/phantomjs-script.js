"use strict";
var page = require('webpage').create(),
    system = require('system');

if (system.args.length < 2) {
    console.log('Usage: loadurlwithoutcss.js URL');
    phantom.exit();
}

var address = system.args[1];

page.onResourceRequested = function(requestData, request) {
    if ((/http:\/\/.+?\.css/gi).test(requestData['url']) || requestData.headers['Content-Type'] == 'text/css') {
        console.log('css: ' + requestData['url']);
        // request.abort();
    }
    if ((/http:\/\/.+?\.js/gi).test(requestData['url']) || requestData.headers['Content-Type'] == 'text/javascript') {
        console.log('js: ' + requestData['url']);
        // request.abort();s
    }
    if ((/http:\/\/.+?\.png/gi).test(requestData['url']) || requestData.headers['Content-Type'] == 'image/png') {
        console.log('png: ' + requestData['url']);
        // request.abort();s
    }
    if ((/http:\/\/.+?\.jpg/gi).test(requestData['url']) || requestData.headers['Content-Type'] == 'image/jpg' || requestData.headers['Content-Type'] == 'image/jpeg') {
        console.log('jpg: ' + requestData['url']);
        // request.abort();s
    }
    if ((/http:\/\/.+?\.gif/gi).test(requestData['url']) || requestData.headers['Content-Type'] == 'image/gif' || requestData.headers['Content-Type'] == 'image/jpeg') {
        console.log('gif: ' + requestData['url']);
        // request.abort();s
    }
};

page.open(address, function(status) {
    if (status === 'success') {
        console.log("loading ok --------------------");
        phantom.exit();
    } else {
        console.log('Unable to load the address!');
        phantom.exit();
    }
});