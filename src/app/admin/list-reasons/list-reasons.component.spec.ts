import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReasonsComponent } from './list-reasons.component';

describe('ListReasonsComponent', () => {
  let component: ListReasonsComponent;
  let fixture: ComponentFixture<ListReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListReasonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
