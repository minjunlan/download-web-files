//πÏº£≤È—Ø
document.writeln("<script language=\"javascript\" src=\"http://pft.zoosnet.net/JS/LsJS.aspx?siteid=PFT36881727&lng=cn\"></script>");

//cnzz
document.writeln("<script type=\"text/javascript\">var cnzz_protocol = ((\"https:\" == document.location.protocol) ? \" https://\" : \" http://\");document.write(unescape(\"%3Cspan id=\'cnzz_stat_icon_1253400992\'%3E%3C/span%3E%3Cscript src=\'\" + cnzz_protocol + \"s6.cnzz.com/z_stat.php%3Fid%3D1253400992\' type=\'text/javascript\'%3E%3C/script%3E\"));</script>");

//baidu
var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?45ee0a0cd1cae6adecf1cc03f58ac603";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

document.writeln('<div id="centertck" style="width: 300px;height: 188px;position: fixed;z-index: 10000;top: 50%;left: 50%;margin-top: -94px;margin-left: -150px;box-shadow: 0px 4px 13px 3px #4a4949;"><img src="images/swt.jpg" usemap="#centermap" style="width:300px;height:188px;"><map name="centermap" id="centermap"><area href="javascript:;" onclick="openZoosUrl()" shape="rect" target="_self" coords="16,145,292,174" /><area href="javascript:void(0)" onclick="hidecenter()" shape="rect" target="_self" coords="283,0,300,48" /></map></div>');

var firsttime = 3000;

setTimeout("showcenter()", firsttime);

function hidecenter() {
    $("#centertck").fadeOut();
    setTimeout("showcenter()", 20000);
}

function showcenter() {
    $("#centertck").fadeIn();
}