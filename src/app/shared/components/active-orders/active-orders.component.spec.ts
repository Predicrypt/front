import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveOrdersComponent } from './active-orders.component';

describe('ActiveOrdersComponent', () => {
  let component: ActiveOrdersComponent;
  let fixture: ComponentFixture<ActiveOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
