import { Component, ViewEncapsulation, ViewChild, ElementRef, PipeTransform, Pipe, OnInit } from '@angular/core';
import {VimeoManage} from '../../service/vimeoservice.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DomSanitizer} from '@angular/platform-browser';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-vimeo-video',
  templateUrl: './vimeo-video.component.html',
  styleUrls: ['./vimeo-video.component.scss']
})


export class VimeoVideoComponent implements OnInit {
  videoList = '';
  constructor(private sanitizer: DomSanitizer, private vimeoControl: VimeoManage, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getVideoList();
  }
  // deleting video
  deleteVideo(uri) {
    this.vimeoControl.deleteVideo(uri).subscribe(res => {
       this.snackBar.open(res.success, 'close');
       this.getVideoList();
    });
  }
  // getting videolist from backend
  getVideoList() {
    this.vimeoControl.getVideoList().subscribe(res => {
      res.body.data.map(item => {
        item.embed.html = this.sanitizer.bypassSecurityTrustHtml(item.embed.html);
      });
      this.videoList = res.body.data;
      setTimeout(() => {
        const elList = document.querySelectorAll('iframe');
        elList.forEach(el => {
          el.setAttribute('width', '300');
          el.setAttribute('height', '150');
        });
      }, 500);
    });
  }

}
