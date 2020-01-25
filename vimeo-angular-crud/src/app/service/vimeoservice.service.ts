import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import {HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VimeoManage {

  constructor(private http: HttpClient) { }
  // video upload service
  vimeoUpload(file: File, fileName, fileDescription): Observable<any> {
    // tslint:disable-next-line:prefer-const
    let formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('fileDescription', fileDescription);
    return this.http.post('/api/upload', formData).pipe(
      map (res => {
        if (res) {
          return res;
        }
      })
    );
  }
  // getting video list service
  getVideoList(): Observable<any> {
    return this.http.get('/api/videolist').pipe(
      map (res => {
        if (res) {
          return res;
        }
      })
    );
  }
  // delete video service
  deleteVideo(uri): Observable<any> {
    uri = uri.split('/')[2];
    return this.http.delete('/api/delete/' + uri).pipe(
      map (res => {
        if (res) {
          return res;
        }
      })
    );
  }
}
