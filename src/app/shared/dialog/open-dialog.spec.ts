import { TestBed } from '@angular/core/testing';

import { OpenDialog } from './open-dialog';

describe('OpenDialog', () => {
  let service: OpenDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenDialog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
