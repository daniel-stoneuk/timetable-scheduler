
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolAdminEventsComponent } from './school-admin-Events.component';

describe('SchoolAdminEventsComponent', () => {
  let component: SchoolAdminEventsComponent;
  let fixture: ComponentFixture<SchoolAdminEventsComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolAdminEventsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolAdminEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
