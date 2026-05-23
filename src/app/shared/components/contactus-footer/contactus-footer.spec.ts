import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactusFooter } from './contactus-footer';

describe('ContactusFooter', () => {
  let component: ContactusFooter;
  let fixture: ComponentFixture<ContactusFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactusFooter],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactusFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
