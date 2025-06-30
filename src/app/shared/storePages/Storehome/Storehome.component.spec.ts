import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Storehome } from './Storehome.component';

describe('Home', () => {
  let component: Storehome;
  let fixture: ComponentFixture<Storehome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Storehome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Storehome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
