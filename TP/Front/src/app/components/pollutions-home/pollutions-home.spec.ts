import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollutionsHome } from './pollutions-home';

describe('PollutionsHome', () => {
  let component: PollutionsHome;
  let fixture: ComponentFixture<PollutionsHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollutionsHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollutionsHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
