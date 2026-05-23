import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureProductCarrousel } from './feature-product-carrousel';

describe('FeatureProductCarrousel', () => {
  let component: FeatureProductCarrousel;
  let fixture: ComponentFixture<FeatureProductCarrousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureProductCarrousel],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureProductCarrousel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
