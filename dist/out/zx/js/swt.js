if (/Android|Windows Phone|webOS|iPhone|iPod|BlackBerry|iPad/i.test(navigator.userAgent)) {
	document.writeln("<script type=\"text/javascript\" src=\"/static/js/sjswt.js\"></script>");
} else {
	document.writeln("<script type=\"text/javascript\" src=\"js/pcswt.js\"></script>");
}

//百度统计
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?47b28858b0884eb54ecdaae785e610bd";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
//swt
document.writeln('<script language="javascript" src="http://pft.zoosnet.net/JS/LsJS.aspx?siteid=PFT33390878&lng=cn"></script>');