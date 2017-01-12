webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var platform_browser_dynamic_1 = __webpack_require__(1);
	var core_1 = __webpack_require__(3);
	var app_module_1 = __webpack_require__(23);
	core_1.enableProdMode();
	var platform = platform_browser_dynamic_1.platformBrowserDynamic();
	platform.bootstrapModule(app_module_1.AppModule);


/***/ },

/***/ 23:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var platform_browser_1 = __webpack_require__(21);
	var http_1 = __webpack_require__(24);
	var app_componet_1 = __webpack_require__(25);
	var AppModule = (function () {
	    function AppModule() {
	    }
	    AppModule = __decorate([
	        core_1.NgModule({
	            imports: [
	                platform_browser_1.BrowserModule,
	                http_1.HttpModule,
	                http_1.JsonpModule
	            ],
	            declarations: [app_componet_1.AppComponent],
	            bootstrap: [app_componet_1.AppComponent]
	        }), 
	        __metadata('design:paramtypes', [])
	    ], AppModule);
	    return AppModule;
	}());
	exports.AppModule = AppModule;


/***/ },

/***/ 25:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var down_class_1 = __webpack_require__(26);
	var core_1 = __webpack_require__(3);
	var http_1 = __webpack_require__(24);
	var $ = __webpack_require__(27);
	__webpack_require__(28);
	__webpack_require__(35);
	var AppComponent = (function () {
	    function AppComponent(http) {
	        this.http = http;
	        this.info = '';
	        this.finished = false;
	        this.countnum = 0;
	        this.downfiles = new Array();
	        this.down = new Array();
	    }
	    AppComponent.prototype.submit = function (url, sdir) {
	        var _this = this;
	        if (!this.check(url, sdir))
	            return;
	        this.down.push(new down_class_1.Down(this.url, this.sdir, new Array()));
	        this.info = "正在分析" + this.url;
	        this.http.post("/downfiles", { url: this.url, savedir: this.sdir, counter: this.countnum++ })
	            .toPromise()
	            .then(function (res) {
	            _this.prefiles = res.json().data;
	            _this.prefiles.forEach(function (v) {
	                _this.http.post("/savefiels", { url: v, savedir: _this.sdir })
	                    .toPromise()
	                    .then(function (rs) {
	                    var data = rs.json();
	                    _this.info = "正在加载下载" + data.url;
	                    // let i = this.down.indexOf(data.savedir);
	                    // this.down[i+1]['cururl'] = data.url;
	                    _this.downfiles.push(data.url);
	                    if (_this.prefiles.length == _this.downfiles.length) {
	                        _this.info = _this.url + " 下载完成！";
	                        _this.finished = true;
	                    }
	                });
	            });
	        });
	    };
	    AppComponent.prototype.check = function (url, sdir) {
	        this.err = new Array();
	        this.url = $(url).val();
	        this.sdir = $(sdir).val();
	        if (!this.url) {
	            this.err.push('请填写要下载的URL！');
	            return false;
	        }
	        if ((/^https/gi.test(this.url))) {
	            this.err.push('目前不支持https的URl,请改成http再试');
	            return false;
	        }
	        if (!(/^http/gi.test(this.url))) {
	            this.err.push('URL要已http开头');
	            return false;
	        }
	        if (!this.sdir) {
	            this.err.push('请填写要保存的文件夹！');
	            return false;
	        }
	        return true;
	    };
	    AppComponent = __decorate([
	        core_1.Component({
	            selector: 'my-app',
	            template: __webpack_require__(37),
	            styles: [__webpack_require__(38)]
	        }), 
	        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
	    ], AppComponent);
	    return AppComponent;
	    var _a;
	}());
	exports.AppComponent = AppComponent;


/***/ },

/***/ 26:
/***/ function(module, exports) {

	"use strict";
	var Down = (function () {
	    function Down(url, outdir, infos) {
	        this.url = url;
	        this.outdir = outdir;
	        this.infos = infos;
	    }
	    return Down;
	}());
	exports.Down = Down;


/***/ },

/***/ 28:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 35:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 37:
/***/ function(module, exports) {

	module.exports = "<div class=\" uk-height-1-1 \">\n    <div class=\"uk-panel uk-container-center\" style=\"width:80%; \">\n        <h1 class=\"uk-h1\">下载专题--node版</h1>\n        <div class=\"uk-form uk-form-horizontal uk-margin-large\">\n\n            <div class=\"uk-form-row\">\n                <label class=\"uk-form-label\">要下载的链接</label>\n                <input #weburl name=\"url\" type=\"text\" placeholder=\"URL\" class=\"uk-form-width-large\">\n            </div>\n            <div class=\"uk-form-row\">\n                <label class=\"uk-form-label\">要保存的文件夹</label>\n                <input #sdir name=\"savedir\" type=\"text\" placeholder=\"保存在out文件夹下\">\n            </div>\n            <div class=\"uk-form-row\">\n                <button class=\"uk-button\" (click)=\"submit(weburl,sdir)\">提交</button>\n            </div>\n            <div class=\"error uk-margin\" *ngIf=\"err\">\n                <ul class=\"uk-list\">\n                    <li *ngFor=\"let e of err\">\n                        <span>{{e}}</span>\n                    </li>\n                </ul>\n            </div>\n            <div class=\"info uk-margin\">\n                <ul class=\"uk-list\">\n                    <li>\n                        <span *ngIf=\"info\">{{info}}<i *ngIf=\"!finished\" class=\"uk-icon-refresh uk-icon-spin\"></i></span>\n                    </li>\n                </ul>\n            </div>\n            <div *ngIf=\"down\">\n                <ul>\n                    <li *ngFor=\"let d of down\">\n                        <p><span>url</span><span>{{d.url}}</span></p>\n                        <p><span>outdir</span><span>{{d.outdir}}</span></p>\n                        <p><span>cururl</span><span>{{d.cururl}}</span></p>\n                        <p><span>infos</span><span>{{d.infos}}</span></p>\n                    </li>\n                </ul>\n            </div>\n            <!--<div class=\"uk-placeholder uk-placeholder-large uk-scrollable-box\" height=\"40%\">\n                <ul class=\"uk-list\">\n                    <li *ngFor=\"let file of downfiles\">\n                        <span>{{file}}</span>-----<span>ok</span>\n                    </li>\n                </ul>\n            </div>-->\n        </div>\n    </div>\n</div>";

/***/ },

/***/ 38:
/***/ function(module, exports) {

	module.exports = "main {\n    padding: 1em;\n    font-family: Arial, Helvetica, sans-serif;\n    text-align: center;\n    margin-top: 50px;\n    display: block;\n}\n\nmain h1 {\n    font-size: 2em;\n}"

/***/ }

});