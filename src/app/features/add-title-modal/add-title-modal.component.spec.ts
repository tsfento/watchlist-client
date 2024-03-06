import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTitleModalComponent } from './add-title-modal.component';

describe('AddTitleModalComponent', () => {
  let component: AddTitleModalComponent;
  let fixture: ComponentFixture<AddTitleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTitleModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTitleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
