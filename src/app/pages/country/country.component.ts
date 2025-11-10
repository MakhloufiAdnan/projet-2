import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { Olympic } from '../../models/olympic.model';
import { Participation } from '../../models/participation.model';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  private olympicUrl = './assets/mock/olympic.json';
  public lineChart!: Chart<'line', number[], number | string>;
  public titlePage = '';
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    let countryName: string | null = null;

    this.route.paramMap.subscribe((param: ParamMap) => {
      countryName = param.get('countryName');
    });

    this.http.get<Olympic[]>(this.olympicUrl).subscribe(
      (data) => {
        if (!countryName) {
          this.error = 'No country provided';
          return;
        }

        const selectedCountry = data.find(
          (o: Olympic) => o.country === countryName
        );

        if (!selectedCountry) {
          this.error = 'Country not found';
          return;
        }

        const participations = selectedCountry.participations;
        const years = participations.map((p: Participation) => p.year);
        const medals = participations.map((p: Participation) => p.medalsCount);
        const nbAthletes = participations.map(
          (p: Participation) => p.athleteCount
        );

        this.titlePage = selectedCountry.country;
        this.totalEntries = participations.length;
        this.totalMedals = medals.reduce(
          (accumulator: number, m: number) => accumulator + m,
          0
        );
        this.totalAthletes = nbAthletes.reduce(
          (accumulator: number, a: number) => accumulator + a,
          0
        );

        this.buildChart(years, medals);
      },
      (error: HttpErrorResponse) => {
        this.error = error.message;
      }
    );
  }

  buildChart(years: number[], medals: number[]) {
    const lineChart = new Chart('countryChart', {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'medals',
            data: medals,
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
