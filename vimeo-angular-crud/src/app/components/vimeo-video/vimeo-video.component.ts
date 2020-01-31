import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {VimeoManage} from '../../service/vimeoservice.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-vimeo-video',
  templateUrl: './vimeo-video.component.html',
  styleUrls: ['./vimeo-video.component.scss']
})
export class VimeoVideoComponent implements OnInit {
  @ViewChild('vimeoUpload', {static: false}) fileInputRef: ElementRef;
  videoList = '';
  uploading = false;
  uploadedFiles: Array < File > ;
  selectedVideoURI = '';
  constructor(private vimeoControl: VimeoManage, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getVideoList();
  }

  selectFile(event): void {
    this.uploadedFiles = event.target.files;
    if (this.checkAllowedType(this.uploadedFiles[0].type)) {
      this.uploading = true;
      this.updateVideo();
    } else {
      this.snackBar.open('file type error', 'close');
    }
  }

  openFileDialog(uri) {
    this.selectedVideoURI = uri;
    this.fileInputRef.nativeElement.click();
  }
  // update Video
  updateVideo() {
    // tslint:disable-next-line:max-line-length
    this.vimeoControl.updateVideo(this.uploadedFiles[0], this.selectedVideoURI).
    subscribe(res => {
      this.snackBar.open('update success!!! Your video URI- https://www.vimeo.com' + res.data.updateVideo.response, 'close');
      this.uploading = false;
      this.selectedVideoURI = '';
      this.getVideoList();
    });
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

  checkAllowedType(filetype: string): boolean {
    const allowed = ['mov', 'wmv', 'avi', 'flv', 'mp4'];
    const videoType = filetype.split('/').pop();
    return allowed.includes(videoType);
  }
}
