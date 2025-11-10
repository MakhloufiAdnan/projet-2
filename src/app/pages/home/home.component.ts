import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { Olympic } from '../../models/olympic.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private olympicUrl = './assets/mock/olympic.json';
  public pieChart!: Chart<'pie', number[], string>;
  public totalCountries = 0;
  public totalJOs = 0;
  public error = '';
  titlePage = 'Medals per Country';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Olympic[]>(this.olympicUrl).subscribe(
      (data) => {
        if (data && data.length > 0) {
          const allParticipations = data.flatMap(
            (o: Olympic) => o.participations
          );

          this.totalJOs = new Set(allParticipations.map((p) => p.year)).size;

          const countries = data.map((o) => o.country);
          this.totalCountries = countries.length;

          const sumOfAllMedalsYears = data.map((o) =>
            o.participations.reduce((acc, p) => acc + p.medalsCount, 0)
          );

          this.buildPieChart(countries, sumOfAllMedalsYears);
        }
      },
      (error: HttpErrorResponse) => {
        console.log(`erreur : ${error}`);
        this.error = error.message;
      }
    );
  }

  buildPieChart(countries: string[], sumOfAllMedalsYears: number[]) {
    const pieChart = new Chart('DashboardPieChart', {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [
          {
            label: 'Medals',
            data: sumOfAllMedalsYears,
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
              true
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
