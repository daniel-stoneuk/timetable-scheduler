import { SchoolAdminRoutingModule } from './school-admin-routing.module';

describe('SchoolAdminRoutingModule', () => {
  let schoolAdminRoutingModule: SchoolAdminRoutingModule;

  beforeEach(() => {
    schoolAdminRoutingModule = new SchoolAdminRoutingModule();
  });

  it('should create an instance', () => {
    expect(schoolAdminRoutingModule).toBeTruthy();
  });
});
