import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorLayoutComponent } from './Vendorlayout.component';

describe('Layout', () => {
  let component: VendorLayoutComponent;
  let fixture: ComponentFixture<VendorLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
