import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGrids } from './product-grids';

describe('ProductGrids', () => {
  let component: ProductGrids;
  let fixture: ComponentFixture<ProductGrids>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductGrids]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductGrids);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
