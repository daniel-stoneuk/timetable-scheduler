import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialiseComponent } from './initialise.component';

describe('InitialiseComponent', () => {
  let component: InitialiseComponent;
  let fixture: ComponentFixture<InitialiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
