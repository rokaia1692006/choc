import { TestBed } from '@angular/core/testing';

import { Description } from './description';

describe('Description', () => {
  let service: Description;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Description);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
