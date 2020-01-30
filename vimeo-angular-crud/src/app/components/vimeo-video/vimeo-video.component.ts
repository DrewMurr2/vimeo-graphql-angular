import { Component, OnInit } from '@angular/core';
import {VimeoManage} from '../../service/vimeoservice.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-vimeo-video',
  templateUrl: './vimeo-video.component.html',
  styleUrls: ['./vimeo-video.component.scss']
})


export class VimeoVideoComponent implements OnInit {
  videoList = '';
  constructor(private vimeoControl: VimeoManage, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getVideoList();
  }
  // deleting video
  deleteVideo(uri) {
    this.vimeoControl.deleteVideo(uri).subscribe(res => {
      this.snackBar.open(res.data.deleteVideo.response, 'close');
      this.getVideoList();
    });
  }
  // getting videolist from backend
  getVideoList() {
    this.vimeoControl.getVideoList().subscribe(res => {
      this.videoList = res.data.videos;
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
