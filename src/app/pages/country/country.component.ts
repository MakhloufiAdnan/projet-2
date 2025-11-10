import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { Olympic } from '../../models/olympic.model';
import { Participation } from '../../models/participation.model';
import { OlympicService } from 'src/app/services/olympic.service';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  public lineChart!: Chart<'line', number[], number | string>;
  public titlePage = '';
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly olympicService: OlympicService,
    private readonly statisticsService: StatisticsService,
  ) {}

  ngOnInit() {
    let countryName: string | null = null;

    this.route.paramMap.subscribe((param: ParamMap) => {
      countryName = param.get('countryName');
    });

    this.olympicService.getOlympics().subscribe({
      next: (data: Olympic[]) => {
        if (!countryName) {
          this.error = 'No country provided';
          return;
        }

        const selectedCountry = data.find(
          (o: Olympic) => o.country === countryName,
        );

        if (!selectedCountry) {
          this.error = 'Country not found';
          return;
        }

        const participations = selectedCountry.participations;
        const years = participations.map((p: Participation) => p.year);
        const medals = participations.map((p: Participation) => p.medalsCount);

        this.titlePage = selectedCountry.country;
        this.totalEntries = participations.length;
        this.totalMedals =
          this.statisticsService.getTotalMedals(participations);
        this.totalAthletes =
          this.statisticsService.getTotalAthletes(participations);

        this.buildChart(years, medals);
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.message;
      },
    });
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
