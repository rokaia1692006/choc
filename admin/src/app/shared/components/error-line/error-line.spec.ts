import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorLine } from './error-line';

describe('ErrorLine', () => {
  let component: ErrorLine;
  let fixture: ComponentFixture<ErrorLine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorLine],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorLine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
