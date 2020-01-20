import { TestBed } from '@angular/core/testing';

import { VimeoManage } from './vimeoservice.service';

describe('VimeoManage', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VimeoManage = TestBed.get(VimeoManage);
    expect(service).toBeTruthy();
  });
});
