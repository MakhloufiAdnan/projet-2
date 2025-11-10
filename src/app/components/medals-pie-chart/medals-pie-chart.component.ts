import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-medals-pie-chart',
  standalone: true,
  imports: [],
  templateUrl: './medals-pie-chart.component.html',
  styleUrls: ['./medals-pie-chart.component.scss'],
})
export class MedalsPieChartComponent implements OnChanges {
  @Input() countries: string[] = [];
  @Input() medals: number[] = [];

  public pieChart!: Chart<'pie', number[], string>;

  constructor(private readonly router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.countries.length && this.medals.length) {
      this.buildPieChart();
    }
  }

  private buildPieChart(): void {
    if (this.pieChart) {
      this.pieChart.destroy();
    }

    const pieChart = new Chart('DashboardPieChart', {
      type: 'pie',
      data: {
        labels: this.countries,
        datasets: [
          {
            label: 'Medals',
            data: this.medals,
            backgroundColor: [
              '#0b868f',
              '#adc3de',
              '#7a3c53',
              '#8f6263',
              'orange',
              '#94819d',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        onClick: (e) => {
          if (e.native) {
            const points = pieChart.getElementsAtEventForMode(
              e.native,
              'point',
              { intersect: true },
              true,
            );
            if (points.length) {
              const firstPoint = points[0];
              const countryName = pieChart.data.labels
                ? pieChart.data.labels[firstPoint.index]
                : '';
              this.router.navigate(['country', countryName]);
            }
          }
        },
      },
    });

    this.pieChart = pieChart;
  }
}
