import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolAdminStudentsEventsDialogComponent } from './school-admin-students-events-dialog.component';

describe('SchoolAdminStudentsEventsDialogComponent', () => {
  let component: SchoolAdminStudentsEventsDialogComponent;
  let fixture: ComponentFixture<SchoolAdminStudentsEventsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolAdminStudentsEventsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolAdminStudentsEventsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
