import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {VimeoManage} from '../../service/vimeoservice.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.scss']
})
export class UploadVideoComponent implements OnInit {
  public vimeoUploadForm: FormGroup;
  uploading = false;
  uploadedFiles: Array < File > ;
  public uploadStatus = 0;
  constructor(private vimeoControl: VimeoManage, private snackBar: MatSnackBar) { }
  selectFile(event): void {
    this.uploadedFiles = event.target.files;
    // filetype check
    if (!this.checkAllowedType(this.uploadedFiles[0].type)) {
      this.uploadStatus = 2;
    }
    // video name and video description validate
    if (!this.getFormValue('vimeoVideoName') || !this.getFormValue('vimeoVideoDescription')) {
      this.uploadStatus = 4;
    } else {
        this.uploading = true;
        this.vimeoUpload();
    }
  }
// uploading video
  vimeoUpload() {
    // tslint:disable-next-line:max-line-length
    this.vimeoControl.vimeoUpload(this.uploadedFiles[0], this.getFormValue('vimeoVideoName'), this.getFormValue('vimeoVideoDescription')).
    subscribe(res => {
      this.snackBar.open('success!!! Your video URI- https://www.vimeo.com' + res.data.createVideo.response, 'close');
      this.uploading = false;
      this.vimeoUploadForm.reset();
    });
  }

  initVimeoForm() {
    this.vimeoUploadForm = new FormGroup(
      {
        vimeoAPI: new FormControl('', [Validators.required]),
        vimeoVideoName: new FormControl('', [Validators.required]),
        vimeoVideoDescription: new FormControl('', [Validators.required])
      }
    );
  }

  allowUpload() {
    this.uploadStatus = 0;
  }

  checkAllowedType(filetype: string): boolean {
    const allowed = ['mov', 'wmv', 'avi', 'flv', 'mp4'];
    const videoType = filetype.split('/').pop();
    return allowed.includes(videoType);
  }

  getFormValue(selector: string) {
    return this.vimeoUploadForm.get(selector).value;
  }

  ngOnInit() {
    this.initVimeoForm();
  }
}
