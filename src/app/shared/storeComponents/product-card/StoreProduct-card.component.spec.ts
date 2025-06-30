import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreProductCard } from './StoreProduct-card.component';

describe('ProductCard', () => {
  let component: StoreProductCard;
  let fixture: ComponentFixture<StoreProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreProductCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreProductCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
