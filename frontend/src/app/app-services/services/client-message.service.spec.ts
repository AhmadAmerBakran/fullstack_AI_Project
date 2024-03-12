import { TestBed } from '@angular/core/testing';

import { ClientMessageService } from './client-message.service';

describe('ClientMessageService', () => {
  let service: ClientMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
