import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolAdminHomeComponent } from './school-admin-home.component';

describe('SchoolAdminHomeComponent', () => {
  let component: SchoolAdminHomeComponent;
  let fixture: ComponentFixture<SchoolAdminHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolAdminHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolAdminHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
