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
import {
  HeaderComponent,
  HeaderIndicator,
} from 'src/app/components/header/header.component';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [
    CommonModule,
    CountryMedalsLineChartComponent,
    RouterLink,
    HeaderComponent,
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

  // Gestion des subscriptions
  private readonly subscriptions = new Subscription();

  // Indicateurs pour le header
  public headerIndicators: HeaderIndicator[] = [];

  // Méthode pour mettre à jour les indicateurs du header
  private updateHeader(
    selectedCountry: Olympic,
    participations: Participation[],
  ): void {
    this.headerIndicators = [
      { label: 'Number of entries', value: participations.length },
      { label: 'Total number of medals', value: this.totalMedals },
      { label: 'Total number of athletes', value: this.totalAthletes },
    ];
  }
  constructor(
    private readonly route: ActivatedRoute,
    private readonly dataService: DataService,
    private readonly statisticsService: StatisticsService,
  ) {}

  ngOnInit(): void {
    let countryId: number | null = null;

    // Récupération de l’ID du pays depuis les paramètres de la route
    const routeSub = this.route.paramMap.subscribe((param: ParamMap) => {
      const idParam = param.get('id');
      countryId = idParam === null ? null : Number(idParam);
    });
    this.subscriptions.add(routeSub);

    // Récupération des données du pays sélectionné
    const dataSub = this.dataService.getOlympics().subscribe({
      next: (data: Olympic[]) => {
        if (countryId == null || Number.isNaN(countryId)) {
          this.error = 'Invalid country id';
          return;
        }

        const selectedCountry = data.find((o: Olympic) => o.id === countryId);

        if (selectedCountry == null) {
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
        this.updateHeader(selectedCountry, participations);
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.message;
      },
    });
    this.subscriptions.add(dataSub);
  }

  // Méthode appelée lors de la destruction du composant
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
