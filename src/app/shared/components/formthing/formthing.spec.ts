import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formthing } from './formthing';

describe('Formthing', () => {
  let component: Formthing;
  let fixture: ComponentFixture<Formthing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formthing],
    }).compileComponents();

    fixture = TestBed.createComponent(Formthing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
