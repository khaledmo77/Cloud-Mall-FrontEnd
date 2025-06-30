import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailSuccess } from './mail-success';

describe('MailSuccess', () => {
  let component: MailSuccess;
  let fixture: ComponentFixture<MailSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailSuccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailSuccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
