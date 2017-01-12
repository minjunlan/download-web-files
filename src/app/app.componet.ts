import { count } from 'rxjs/operator/count';
import { Down } from './down.class';
import { jsonpFactory } from '@angular/http/src/http_module';
import { Component } from '@angular/core';
import { Http, Jsonp } from '@angular/http';
import * as $ from 'jquery';

import '../../node_modules/uikit/dist/css/uikit.min.css';
import '../../public/css/style.css';


@Component({
  selector: 'my-app',
  templateUrl: './app.componet.html',
  styleUrls: ['./app.componet.css']
})

export class AppComponent {
  public url: string;
  public sdir: string;
  public info = '';
  public down : Down[];
  public prefiles: string[];
  public downfiles: any[];
  public finished = false;
  public err : string[];
  public countnum = 0;

  constructor(private http: Http) {
    this.downfiles = new Array<any>();
    this.down = new Array<Down>();
  }

  submit(url: HTMLInputElement, sdir: HTMLInputElement) {
    if(!this.check(url,sdir))return;
    
    this.down.push(new Down(this.url,this.sdir,new Array<string>()));

    this.info = "正在分析"+this.url;

    this.http.post("/downfiles", { url: this.url, savedir: this.sdir, counter:  this.countnum++})
      .toPromise()
      .then(res => {
        this.prefiles = res.json().data;
        this.prefiles.forEach((v) => {
          this.http.post("/savefiels", { url: v, savedir: this.sdir })
            .toPromise()
            .then(rs => {
              let data = rs.json();
              this.info = "正在加载下载"+data.url;
              // let i = this.down.indexOf(data.savedir);
              // this.down[i+1]['cururl'] = data.url;
              this.downfiles.push(data.url);
              if(this.prefiles.length == this.downfiles.length){
                this.info = this.url+" 下载完成！";
                this.finished = true;
              }
            })
        })
      })
  }

  private check(url: HTMLInputElement, sdir: HTMLInputElement):boolean{
      this.err = new Array<string>();
      this.url = $(url).val();
      this.sdir = $(sdir).val();
      if(!this.url){
        this.err.push('请填写要下载的URL！');
        return false;
      }
      if((/^https/gi.test(this.url))){
        this.err.push('目前不支持https的URl,请改成http再试');
        return false;
      } 
      if(!(/^http/gi.test(this.url))){
        this.err.push('URL要已http开头');
        return false;
      }      
      if(!this.sdir){
        this.err.push('请填写要保存的文件夹！');
        return false;
      }
      return true;
  }

}
