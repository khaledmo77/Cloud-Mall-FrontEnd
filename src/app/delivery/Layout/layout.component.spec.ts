import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryLayoutComponent } from './layout.component';

describe('Layout', () => {
  let component: DeliveryLayoutComponent;
  let fixture: ComponentFixture<DeliveryLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeliveryLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
