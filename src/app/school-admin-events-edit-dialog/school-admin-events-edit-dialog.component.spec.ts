import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolAdminEventsEditDialogComponent } from './school-admin-events-edit-dialog.component';

describe('SchoolAdminEventsEditDialogComponent', () => {
  let component: SchoolAdminEventsEditDialogComponent;
  let fixture: ComponentFixture<SchoolAdminEventsEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolAdminEventsEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolAdminEventsEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
