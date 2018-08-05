
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolAdminStudentsComponent } from './school-admin-students.component';

describe('SchoolAdminStudentsComponent', () => {
  let component: SchoolAdminStudentsComponent;
  let fixture: ComponentFixture<SchoolAdminStudentsComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolAdminStudentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolAdminStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
