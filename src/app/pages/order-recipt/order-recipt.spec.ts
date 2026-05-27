import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRecipt } from './order-recipt';

describe('OrderRecipt', () => {
  let component: OrderRecipt;
  let fixture: ComponentFixture<OrderRecipt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderRecipt],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderRecipt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
