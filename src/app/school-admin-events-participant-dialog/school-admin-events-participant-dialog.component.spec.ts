import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolAdminEventsParticipantDialogComponent } from './school-admin-events-participant-dialog.component';

describe('SchoolAdminEventsParticipantDialogComponent', () => {
  let component: SchoolAdminEventsParticipantDialogComponent;
  let fixture: ComponentFixture<SchoolAdminEventsParticipantDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolAdminEventsParticipantDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolAdminEventsParticipantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
