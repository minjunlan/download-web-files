import { BADFAMILY } from 'dns';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as childProcess from 'child_process';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as iconv from 'iconv-lite'; //转换字符编码 node 的字符编码支持比较少

var jschardet = require('jschardet');//检测字符编码

var phantomjs = require('phantomjs-prebuilt');

var binPath = phantomjs.path
var app = express();
var outdir = "out";
var regstr = `\\(?(?:(http|https|ftp):\\/\\/)?(?:((?:[^\\W\\s]|\\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\\W\\s]|\\.|-)+[\\.][^\\W\\s]{2,4}|localhost(?=\\/)|\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})(?::(\\d*))?([\\/]?[^\\s\\?]*[\\/]{1})*(?:\\/?([^\\s\\n\\?\\[\\]\\{\\}\\#]*(?:(?=\\.)){1}|[^\\s\\n\\?\\[\\]\\{\\}\\.\\#]*)?([\\.]{1}[^\\s\\?\\#]*)?)?(?:\\?{1}([^\\s\\n\\#\\[\\]]*))?([\\#][^\\s\\n]*)?\\)?`;

const hostname = 'localhost';
const port = 8888;
var imgarr = new Array<string>();
var cssarr = new Array<string>();
var jsarr = new Array<string>();

app.use(bodyParser.json())
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', function (req, res) {
    fs.readFile('./index.html', (err, data) => {
        res.send(data.toString());
    })
    
});

app.post('/downfiles', function (req, res) {
    var url = req.body.url;
    var savedir = req.body.savedir;
    var childArgs = [
        path.join(__dirname, 'phantomjs-script.js'),
        url,
        savedir
    ]

    childProcess.execFile(binPath, childArgs, function (err, stdout, stderr) {
        if (!stderr) {
            fs.readFile(savedir+".txt", 'utf-8', (err, data) => {
                if (!err) {
                    imgarr = JSON.parse(data).imgdata;
                    jsarr = JSON.parse(data).jsdata;
                    cssarr = JSON.parse(data).cssdata;
                    res.json(JSON.parse(data));
                }
            });

        }

    })

})

app.post('/savefiels', function(req, res) {
    let url = req.body.url;
    let savedir = req.body.savedir;
    let reg = new RegExp(regstr, 'img');
    let arr = reg.exec("" + url);
    let thirddir = !arr[7] ? '' : arr[7].toLowerCase() === '.css' ? 'css' : arr[7].toLowerCase() === '.js' ? 'js' : arr[7].toLowerCase() === '.html' || arr[7].toLowerCase() === '.htm' ? '' : 'images';
    let filename = !arr[7] && !arr[6] ? 'index.html' : arr[6] + arr[7];
    let ext      = !arr[7] ? '.html': arr[7];
    let filepath = arr[5] + (!!arr[6] ? arr[6] : '') + (!!arr[7] ? arr[7] : '') + (!!arr[8] ? arr[8] : '') + (!!arr[9] ? arr[9] : '');
    let options = {
        hostname: arr[3],
        path: filepath
    };
    let requ = http.get(url, function(rs) {
        if(rs.statusCode == 200 ){
            let p = path.join(__dirname, outdir, savedir, thirddir, filename);
            let d = path.join(__dirname, outdir, savedir, thirddir);
            mkmutidir(d);
            let content=new Buffer(0);
            rs.on('data', (chunk) => {
                content=Buffer.concat([content,<Buffer>chunk]); 
            });
            rs.on('end', () => {
                if(ext == '.html'){
                    content = changeurl(content,ext,imgarr,jsarr,cssarr);
                }
                if(ext == '.css'){
                    content = changeurl(content,ext,imgarr,cssarr);
                }
                if(ext == '.js'){
                    content = changeurl(content,ext,imgarr,jsarr,cssarr);
                }
                if(fs.existsSync(p)){
                    p = path.join(__dirname, outdir, savedir, thirddir, arr[6]+'-b' + arr[7]);
                }
                fs.writeFileSync(p, content);
                res.json({ url: url });
            })
        }
    });
    requ.on('error', (e) => {
        // res.json({ status: e.message });
    });

});

var server = app.listen(port, function () {
    console.log(`Example app listening at http://${hostname}:${port}`);
});


function mkmutidir(p:string){
    let d = fs.existsSync(p);
    if(d){
        return ;
    }
    mkmutidir(path.join(p,'..'));
    fs.mkdirSync(p);
}

function escapeRegExp(str:string) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function changeurl(buffer:Buffer,ext:string,...arr:string[][]) :Buffer {
    let a = arr.join(',').split(',');
    let charset = jschardet.detect(buffer);
    charset.encoding = iconv.encodingExists(charset.encoding) ? charset.encoding: 'utf-8';
    let b =  iconv.decode(buffer,charset.encoding); 
    let jsdir = arr.length === 3 ? 'js/' : '../js/';
    let cssdir = arr.length === 3 ? 'css/' : '../css/';
    let imgdir = arr.length === 3 ? 'images/' : '../images/';
    a.forEach(v=>{
        //let s = v.replace('.','\.');
        if (!v) return;
        let reg = new RegExp(`(['"(\\\\])((?:[^'"(\\\\]*[\\\/]+)*)(${v})([^'")]*)(['")\\\\])`,'ig');
        
        if(/\.js/gi.test(v)){
            b = b.replace(reg,"$1"+jsdir+"$3$4$5");
        }else if(/\.css/gi.test(v)){
            b = b.replace(reg,"$1"+cssdir+"$3$4$5");
        }else{
            b = b.replace(reg,"$1"+imgdir+"$3$4$5");
        }
    })
    return iconv.encode(b,charset.encoding);
}