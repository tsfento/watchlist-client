import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchDatesComponent } from './watch-dates.component';

describe('WatchDatesComponent', () => {
  let component: WatchDatesComponent;
  let fixture: ComponentFixture<WatchDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchDatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WatchDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
