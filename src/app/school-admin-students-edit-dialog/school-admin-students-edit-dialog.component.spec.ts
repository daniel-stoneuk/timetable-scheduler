import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolAdminStudentsEditDialogComponent } from './school-admin-students-edit-dialog.component';

describe('SchoolAdminStudentsEditDialogComponent', () => {
  let component: SchoolAdminStudentsEditDialogComponent;
  let fixture: ComponentFixture<SchoolAdminStudentsEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolAdminStudentsEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolAdminStudentsEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
