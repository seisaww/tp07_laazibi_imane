import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollutionFrom } from './pollution-from';

describe('pollutionFrom', () => {
  let component: PollutionFrom;
  let fixture: ComponentFixture<PollutionFrom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollutionFrom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollutionFrom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
