import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {VimeoManage} from '../../service/vimeoservice.service';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.scss']
})
export class UploadVideoComponent implements OnInit {
  public vimeoUploadForm: FormGroup;
  private data: any;
  public uploadPercent;
  public uploadStatus = 0;
  constructor(private vimeoControl: VimeoManage) { }
  selectFile(event): void {
    this.uploadVimeoVideo(event.target.files);
  }
  uploadVimeoVideo(files: FileList): void {
    console.log(files[0]);
    this.uploadStatus = 1;
    if (files.length === 0) {
      console.log('No file selected!');
      return;
    }
    const file: File = files[0];
    const isAccepted = this.checkAllowedType(file.type);
    if (isAccepted) {
      this.uploadStatus = 1;
      const options = {
        token : this.getFormValue('vimeoAPI'),
        url : 'https://api.vimeo.com/me/videos',
        videoName: this.getFormValue('vimeoVideoName'),
        videoDescription: this.getFormValue('vimeoVideoDescription')
      };
      this.vimeoControl.createVimeo(options, file.size)
        .pipe(
          map(data => this.data = data),
          switchMap(
            () => {
              console.log(this.data);
              this.vimeoControl.updateVimeoLink(this.data.link);
              if (this.data.upload.size === file.size) {
                return this.vimeoControl.vimeoUpload(this.data.upload.upload_link, file);
              } else {
                this.uploadStatus = 4;
              }
            }
          )
        ).subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadPercent = Math.round(100 * event.loaded / event.total);
            this.uploadStatus = 3;
          } else if (event instanceof HttpResponse) {
            this.uploadStatus = 5;
            setTimeout(() => {
              this.uploadStatus = 0;
            }, 5000);
          }
        },
        (error) => {
          console.log('Upload Error:', error);
          this.uploadStatus = 4;
        }, () => {
          console.log('Upload done');
        }
      );
    } else {
      this.uploadStatus = 2;
    }
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
  allowUpload(): void {
    this.uploadStatus = 0;
  }

  checkAllowedType(filetype: string): boolean {
    const allowed = ['mov', 'wmv', 'avi', 'flv', 'mp4'];
    const videoType = filetype.split('/').pop();
    console.log(videoType);
    return allowed.includes(videoType);
  }

  getFormValue(selector: string) {
    return this.vimeoUploadForm.get(selector).value;
  }

  ngOnInit() {
    // Init Vimeo Data Form
    this.initVimeoForm();
    // Return Vimeo Link from API response
    this.vimeoControl.vimeoLinkObs.subscribe(
      data => {
        console.log(data);
      }, error => {
        throw new Error(error);
      }
    );
  }
}
