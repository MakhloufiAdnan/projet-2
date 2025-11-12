import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-country-medals-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './country-medals-line-chart.component.html',
  styleUrl: './country-medals-line-chart.component.scss',
})
export class CountryMedalsLineChartComponent implements OnChanges {
  @Input() years: number[] = [];
  @Input() medals: number[] = [];

  public lineChart!: Chart<'line', number[], number | string>;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.years.length && this.medals.length) {
      this.buildChart();
    }
  }

  private buildChart(): void {
    if (this.lineChart) {
      this.lineChart.destroy();
    }

    const lineChart = new Chart('countryChart', {
      type: 'line',
      data: {
        labels: this.years,
        datasets: [
          {
            label: 'medals',
            data: this.medals,
            backgroundColor: '#0b868f',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });

    this.lineChart = lineChart;
  }
}
