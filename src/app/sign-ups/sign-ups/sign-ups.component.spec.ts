import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpsComponent } from './sign-ups.component';

describe('SignUpsComponent', () => {
  let component: SignUpsComponent;
  let fixture: ComponentFixture<SignUpsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpsComponent]
    });
    fixture = TestBed.createComponent(SignUpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
