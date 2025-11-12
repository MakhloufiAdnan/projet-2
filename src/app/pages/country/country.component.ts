import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Olympic } from '../../models/olympic.model';
import { Participation } from '../../models/participation.model';
import { DataService } from 'src/app/services/data.service';
import { StatisticsService } from 'src/app/services/statistics.service';
import { CountryMedalsLineChartComponent } from 'src/app/components/country-medals-line-chart/country-medals-line-chart.component';
import { StatCardComponent } from 'src/app/components/stat-card/stat-card.component';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [
    CommonModule,
    CountryMedalsLineChartComponent,
    RouterLink,
    StatCardComponent,
  ],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss',
})
export class CountryComponent implements OnInit, OnDestroy {
  public titlePage = '';
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error = '';
  public years: number[] = [];
  public medals: number[] = [];

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dataService: DataService,
    private readonly statisticsService: StatisticsService,
  ) {}

  ngOnInit(): void {
    let countryName: string | null = null;

    const routeSub = this.route.paramMap.subscribe((param: ParamMap) => {
      countryName = param.get('id');
    });
    this.subscriptions.add(routeSub);

    const dataSub = this.dataService.getOlympics().subscribe({
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
    this.subscriptions.add(dataSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
