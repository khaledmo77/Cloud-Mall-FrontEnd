import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreHeader } from './StoreHeader.component';

describe('Header', () => {
  let component: StoreHeader;
  let fixture: ComponentFixture<StoreHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
