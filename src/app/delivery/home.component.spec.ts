import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryHomeComponent } from './home.component';

describe('Home', () => {
  let component: DeliveryHomeComponent;
  let fixture: ComponentFixture<DeliveryHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
