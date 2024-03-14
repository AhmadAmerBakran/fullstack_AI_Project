import { TestBed } from '@angular/core/testing';

import { TranslateModalService } from './translate-modal.service';

describe('TranslateModalService', () => {
  let service: TranslateModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslateModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
