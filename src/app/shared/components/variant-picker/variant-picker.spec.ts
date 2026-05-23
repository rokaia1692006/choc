import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantPicker } from './variant-picker';

describe('VariantPicker', () => {
  let component: VariantPicker;
  let fixture: ComponentFixture<VariantPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariantPicker],
    }).compileComponents();

    fixture = TestBed.createComponent(VariantPicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
