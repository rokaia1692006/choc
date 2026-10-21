import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPassPage } from './forget-pass-page';

describe('ForgetPassPage', () => {
  let component: ForgetPassPage;
  let fixture: ComponentFixture<ForgetPassPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgetPassPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgetPassPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
