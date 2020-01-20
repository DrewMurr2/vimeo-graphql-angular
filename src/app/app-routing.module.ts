import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VimeoVideoComponent } from './components/vimeo-video/vimeo-video.component';
import { UploadVideoComponent } from './components/upload-video/upload-video.component';

const routes: Routes = [
  {path: 'upload', component: UploadVideoComponent},
  {path: 'list', component: VimeoVideoComponent},
  {path: '', redirectTo: '/upload', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
