import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';
@Injectable({
  providedIn: 'root'
})
export class VimeoManage {
  videoListQuery = gql`
    query videoList {
      videos {
        uri
        name
        description
        embed {
          html
        }
      }
    }
  `;
  constructor(private apollo: Apollo, private http: HttpClient) { }
  // video upload service
  vimeoUpload(file: File, fileName, fileDescription): Observable<any> {
    // tslint:disable-next-line:prefer-const
    return this.apollo.mutate({
      mutation: gql`
        mutation createVideo($file: Upload!, $fileName:String!, $fileDescription:String!) {
          createVideo(file: $file, videoName: $fileName, videoDescription: $fileDescription) {
            response
          }
        }
      `,
      variables: {
        file,
        fileName,
        fileDescription
      },
      context: {
         useMultipart: true
      },
      refetchQueries: [{query: this.videoListQuery}]
    }).pipe(
        map(res => res)
      );
  }
  updateVideo(file: File, uri): Observable<any> {
    // tslint:disable-next-line:prefer-const
    return this.apollo.mutate({
      mutation: gql`
        mutation updateVideo($file: Upload!, $uri: ID) {
          updateVideo(file: $file, videoURI: $uri) {
            response
          }
        }
      `,
      variables: {
        file,
        uri
      },
      context: {
         useMultipart: true
      },
      refetchQueries: [{query: this.videoListQuery}]
    }).pipe(
        map(res => res)
      );
  }
  // getting video list service
  getVideoList(): Observable<any> {
    return this.apollo.watchQuery({
      query: this.videoListQuery
    })
      .valueChanges
      .pipe(
        map(res => res)
      );
  }
  // delete video service
  deleteVideo(uri): Observable<any> {
    uri = uri.split('/')[2];
    return this.apollo.mutate({
      mutation: gql`
        mutation deleteVideo($uri: ID) {
          deleteVideo(videoURI: $uri) {
            response
          }
        }
      `,
      variables: {
        uri
      },
      refetchQueries: [{query: this.videoListQuery}]
    }).pipe(
        map(res => res)
      );
  }
}
