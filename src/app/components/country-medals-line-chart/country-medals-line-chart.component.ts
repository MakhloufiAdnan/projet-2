import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-country-medals-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './country-medals-line-chart.component.html',
  styleUrl: './country-medals-line-chart.component.scss',
})
export class CountryMedalsLineChartComponent implements OnChanges, OnDestroy {
  @Input() years: number[] = [];
  @Input() medals: number[] = [];

  public lineChart!: Chart<'line', number[], number | string>;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.years.length && this.medals.length) {
      this.buildChart();
    }
  }

  ngOnDestroy(): void {
    if (this.lineChart) {
      this.lineChart.destroy();
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
            label: 'Medals',
            data: this.medals,
            backgroundColor: '#0b868f',
            borderColor: '#0b868f',
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Year',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Medals',
            },
            beginAtZero: true,
          },
        },
      },
    });

    this.lineChart = lineChart;
  }
}
