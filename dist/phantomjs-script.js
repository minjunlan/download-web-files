"use strict";
var page = require('webpage').create(),
    fs = require('fs'),
    system = require('system');


if (system.args.length < 2) {
    console.log('Usage: loadurlwithoutcss.js URL');
    phantom.exit();
}

var address = system.args[1];

var rs = Array();
var imgarr = Array();
var jsarr = Array();
var cssarr = Array();
var filename = system.args[2];

page.onResourceRequested = function(requestData, request) {
    if ((/(baidu.com)|(zoosnet.net)|(cnzz.com)|(mmstat.com)/gi).test(requestData['url']))
        return;
    if ((/^https/i).test(requestData['url'])) { //有https的转换成http
        requestData['url'] = requestData['url'].replace('https', 'http');

    }
    var reg = /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/g;
    var a = reg.exec(String(requestData['url']));
    var files = a[6] + a[7];

    if ((/(\.jpe?g)|(\.png)|(\.gif)|(\.swf)|(\.svg)$/gi).test(requestData['url'].toLowerCase())) {
        if (imgarr.indexOf(files) >= 0) {
            files = a[6] + '-b' + a[7];
        }
        imgarr.push(files);
    }
    if ((/\.js$/gi).test(requestData['url'].toLowerCase())) {
        if (imgarr.indexOf(files) >= 0) {
            files = a[6] + '-b' + a[7];
        }
        jsarr.push(files);
    }
    if ((/\.css$/gi).test(requestData['url'].toLowerCase())) {
        if (imgarr.indexOf(files) >= 0) {
            files = a[6] + '-b' + a[7];
        }
        imgarr.push(files);
    }

    rs.push(String(requestData['url']));
};

page.open(address, function(status) {
    if (status === 'success') {
        var t = rs.join(",");
        try {
            fs.write(filename + '.txt', JSON.stringify({ data: rs, imgdata: imgarr, jsdata: jsarr, cssdata: cssarr }), 'w');
        } catch (e) {
            console.log(e);
        }
        //system.stderr.write(JSON.stringify(imgarr));
        phantom.exit();
    } else {
        phantom.exit();
    }
});