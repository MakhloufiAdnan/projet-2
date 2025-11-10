import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { Olympic } from '../../models/olympic.model';
import { Participation } from '../../models/participation.model';
import { OlympicService } from 'src/app/services/olympic.service';
import { StatisticsService } from 'src/app/services/statistics.service';
import { CountryMedalsLineChartComponent } from 'src/app/components/country-medals-line-chart/country-medals-line-chart.component';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [CommonModule, CountryMedalsLineChartComponent, RouterLink],
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  public titlePage = '';
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error = '';
  public years: number[] = [];
  public medals: number[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly olympicService: OlympicService,
    private readonly statisticsService: StatisticsService,
  ) {}

  ngOnInit(): void {
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

        this.years = participations.map((p: Participation) => p.year);
        this.medals = participations.map((p: Participation) => p.medalsCount);

        this.titlePage = selectedCountry.country;
        this.totalEntries = participations.length;
        this.totalMedals =
          this.statisticsService.getTotalMedals(participations);
        this.totalAthletes =
          this.statisticsService.getTotalAthletes(participations);
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.message;
      },
    });
  }
}
