import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-medals-pie-chart',
  standalone: true,
  imports: [],
  templateUrl: './medals-pie-chart.component.html',
  styleUrl: './medals-pie-chart.component.scss',
})
export class MedalsPieChartComponent implements OnChanges, OnDestroy {
  // Input pour les propriété countries, medals, et country IDs
  @Input() countries: string[] = [];
  @Input() medals: number[] = [];
  @Input() countryIds: number[] = [];

  public pieChart!: Chart<'pie', number[], string>;

  constructor(private readonly router: Router) {}

  // Méthode appelée à chaque changement des inputs
  ngOnChanges(changes: SimpleChanges): void {
    if (this.countries.length && this.medals.length) {
      this.buildPieChart();
    }
  }

  // Méthode appelée lors de la destruction du composant
  ngOnDestroy(): void {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
  }

  // Méthode pour construire le graphique
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

      //  Options du graphique
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'center',
            labels: {
              boxWidth: 12,
              padding: 8,
            },
          },
        },

        // Gestion du clic sur une portion du graphique
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
              const countryId = this.countryIds[firstPoint.index];
              if (countryId != null) {
                this.router.navigate(['country', countryId]);
              }
            }
          }
        },
      },
    });

    this.pieChart = pieChart;
  }
}
