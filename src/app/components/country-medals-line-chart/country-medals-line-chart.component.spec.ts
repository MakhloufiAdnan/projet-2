import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryMedalsLineChartComponent } from './country-medals-line-chart.component';

describe('CountryMedalsLineChartComponent', () => {
  let component: CountryMedalsLineChartComponent;
  let fixture: ComponentFixture<CountryMedalsLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryMedalsLineChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CountryMedalsLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
