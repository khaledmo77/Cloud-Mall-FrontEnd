import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorePreloadercomponent } from './StorePreloader.component';

describe('Preloader', () => {
  let component: StorePreloadercomponent;
  let fixture: ComponentFixture<StorePreloadercomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorePreloadercomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorePreloadercomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
