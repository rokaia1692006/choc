import { TestBed } from '@angular/core/testing';

import { ForgetPass } from './forget-pass';

describe('ForgetPass', () => {
  let service: ForgetPass;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForgetPass);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
