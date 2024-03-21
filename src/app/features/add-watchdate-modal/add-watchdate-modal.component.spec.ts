import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWatchdateModalComponent } from './add-watchdate-modal.component';

describe('AddWatchdateModalComponent', () => {
  let component: AddWatchdateModalComponent;
  let fixture: ComponentFixture<AddWatchdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWatchdateModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddWatchdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
