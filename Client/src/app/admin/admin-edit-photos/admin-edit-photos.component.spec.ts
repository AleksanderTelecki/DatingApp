import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditPhotosComponent } from './admin-edit-photos.component';

describe('AdminEditPhotosComponent', () => {
  let component: AdminEditPhotosComponent;
  let fixture: ComponentFixture<AdminEditPhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEditPhotosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
