import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDiscription } from './product-discription';

describe('ProductDiscription', () => {
  let component: ProductDiscription;
  let fixture: ComponentFixture<ProductDiscription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDiscription],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDiscription);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
