
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SchoolAdminComponent } from './school-admin.component';

describe('SchoolAdminComponent', () => {
  let component: SchoolAdminComponent;
  let fixture: ComponentFixture<SchoolAdminComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatSidenavModule],
      declarations: [SchoolAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
