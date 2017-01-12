"use strict";
var http = require('http');
var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');
var express = require('express');
var bodyParser = require('body-parser');
var iconv = require('iconv-lite'); //转换字符编码 node 的字符编码支持比较少
var jschardet = require('jschardet'); //检测字符编码
var phantomjs = require('phantomjs-prebuilt');
var binPath = phantomjs.path;
var app = express();
var outdir = "out";
var regstr = "\\(?(?:(http|https|ftp):\\/\\/)?(?:((?:[^\\W\\s]|\\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\\W\\s]|\\.|-)+[\\.][^\\W\\s]{2,4}|localhost(?=\\/)|\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})(?::(\\d*))?([\\/]?[^\\s\\?]*[\\/]{1})*(?:\\/?([^\\s\\n\\?\\[\\]\\{\\}\\#]*(?:(?=\\.)){1}|[^\\s\\n\\?\\[\\]\\{\\}\\.\\#]*)?([\\.]{1}[^\\s\\?\\#]*)?)?(?:\\?{1}([^\\s\\n\\#\\[\\]]*))?([\\#][^\\s\\n]*)?\\)?";
var hostname = 'localhost';
var port = 8888;
var imgarr = new Array();
var cssarr = new Array();
var jsarr = new Array();
app.use(bodyParser.json());
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.get('/', function(req, res) {
    fs.readFile('./index.html', function(err, data) {
        res.send(data.toString());
    });
});
app.post('/downfiles', function(req, res) {
    var url = req.body.url;
    var savedir = req.body.savedir;
    var childArgs = [
        path.join(__dirname, 'phantomjs-script.js'),
        url,
        savedir
    ];
    childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
        if (!stderr) {
            fs.readFile(savedir + ".txt", 'utf-8', function(err, data) {
                if (!err) {
                    imgarr = JSON.parse(data).imgdata;
                    jsarr = JSON.parse(data).jsdata;
                    cssarr = JSON.parse(data).cssdata;
                    res.json(JSON.parse(data));
                }
            });
        }
    });
});
app.post('/savefiels', function(req, res) {
    var url = req.body.url;
    var savedir = req.body.savedir;
    var reg = new RegExp(regstr, 'img');
    var arr = reg.exec("" + url);
    var thirddir = !arr[7] ? '' : arr[7].toLowerCase() === '.css' ? 'css' : arr[7].toLowerCase() === '.js' ? 'js' : arr[7].toLowerCase() === '.html' || arr[7].toLowerCase() === '.htm' ? '' : 'images';
    var filename = !arr[7] && !arr[6] ? 'index.html' : arr[6] + arr[7];
    var ext = !arr[7] ? '.html' : arr[7];
    var filepath = arr[5] + (!!arr[6] ? arr[6] : '') + (!!arr[7] ? arr[7] : '') + (!!arr[8] ? arr[8] : '') + (!!arr[9] ? arr[9] : '');
    var options = {
        hostname: arr[3],
        path: filepath
    };
    var requ = http.get(url, function(rs) {
        if (rs.statusCode == 200) {
            var p_1 = path.join(__dirname, outdir, savedir, thirddir, filename);
            var d = path.join(__dirname, outdir, savedir, thirddir);
            mkmutidir(d);
            var content_1 = new Buffer(0);
            rs.on('data', function(chunk) {
                content_1 = Buffer.concat([content_1, chunk]);
            });
            rs.on('end', function() {
                if (ext == '.html') {
                    content_1 = changeurl(content_1, ext, imgarr, jsarr, cssarr);
                }
                if (ext == '.css') {
                    content_1 = changeurl(content_1, ext, imgarr, cssarr);
                }
                if (ext == '.js') {
                    content_1 = changeurl(content_1, ext, imgarr, jsarr, cssarr);
                }
                if (fs.existsSync(p_1)) {
                    p_1 = path.join(__dirname, outdir, savedir, thirddir, arr[6] + '-b' + arr[7]);
                }
                fs.writeFileSync(p_1, content_1);
                res.json({ url: url });
            });
        }
    });
    requ.on('error', function(e) {
        // res.json({ status: e.message });
    });
});
var server = app.listen(port, function() {
    console.log("Example app listening at http://" + hostname + ":" + port);
});

function mkmutidir(p) {
    var d = fs.existsSync(p);
    if (d) {
        return;
    }
    mkmutidir(path.join(p, '..'));
    fs.mkdirSync(p);
}

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function changeurl(buffer, ext) {
    var arr = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        arr[_i - 2] = arguments[_i];
    }
    var a = arr.join(',').split(',');
    var charset = jschardet.detect(buffer);
    charset.encoding = iconv.encodingExists(charset.encoding) ? charset.encoding : 'utf-8';
    var b = iconv.decode(buffer, charset.encoding);
    var jsdir = arr.length === 3 ? 'js/' : '../js/';
    var cssdir = arr.length === 3 ? 'css/' : '../css/';
    var imgdir = arr.length === 3 ? 'images/' : '../images/';
    a.forEach(function(v) {
        //let s = v.replace('.','\.');
        if (!v)
            return;
        var reg = new RegExp("(['\"(\\\\])((?:[^'\"(\\\\]*[\\/]+)*)(" + v + ")([^'\")]*)(['\")\\\\])", 'ig');
        if (/\.js/gi.test(v)) {
            b = b.replace(reg, "$1" + jsdir + "$3$4$5");
        } else if (/\.css/gi.test(v)) {
            console.log(reg);
            b = b.replace(reg, "$1" + cssdir + "$3$4$5");
        } else {
            b = b.replace(reg, "$1" + imgdir + "$3$4$5");
        }
    });
    return iconv.encode(b, charset.encoding);
}