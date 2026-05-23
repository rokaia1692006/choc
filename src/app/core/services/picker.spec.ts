import { TestBed } from '@angular/core/testing';

import { Picker } from './picker';

describe('Picker', () => {
  let service: Picker;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Picker);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
