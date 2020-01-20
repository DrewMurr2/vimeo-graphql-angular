import { Component, ViewEncapsulation, ViewChild, ElementRef, PipeTransform, Pipe, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-vimeo-video',
  templateUrl: './vimeo-video.component.html',
  styleUrls: ['./vimeo-video.component.scss']
})


export class VimeoVideoComponent implements OnInit {
  video = '../../assets/test.mp4';
  constructor() { }

  ngOnInit() {
  }

}
