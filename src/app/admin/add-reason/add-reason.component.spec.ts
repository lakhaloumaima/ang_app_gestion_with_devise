import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReasonComponent } from './add-reason.component';

describe('AddReasonComponent', () => {
  let component: AddReasonComponent;
  let fixture: ComponentFixture<AddReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReasonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
