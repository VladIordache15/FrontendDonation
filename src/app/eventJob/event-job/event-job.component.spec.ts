import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventJobComponent } from './event-job.component';

describe('EventJobComponent', () => {
  let component: EventJobComponent;
  let fixture: ComponentFixture<EventJobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventJobComponent]
    });
    fixture = TestBed.createComponent(EventJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
