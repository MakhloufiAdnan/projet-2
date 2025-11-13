import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, filter, map, switchMap } from 'rxjs';
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
  private updateHeader(participations: Participation[]): void {
    this.headerIndicators = [
      { label: 'Number of entries', value: participations.length },
      { label: 'Total number of medals', value: this.totalMedals },
      { label: 'Total number of athletes', value: this.totalAthletes },
    ];
  }
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dataService: DataService,
    private readonly statisticsService: StatisticsService,
  ) {}

  ngOnInit(): void {
    // Récupération de l’ID du pays depuis les paramètres de l’URL
    const sub = this.route.paramMap
      .pipe(
        map((params) => Number(params.get('id'))),
        filter((id) => Number.isFinite(id) && Number.isInteger(id) && id > 0),
        switchMap((countryId) =>
          this.dataService
            .getOlympics()
            .pipe(map((data) => ({ data, countryId }))),
        ),
      )
      .subscribe({
        next: ({ data, countryId }) => {
          const selectedCountry = data.find((o) => o.id === countryId);
          if (selectedCountry == null) {
            // Si le pays inexistant : redirection vers la page not-found
            this.router.navigate(['/not-found']);
            return;
          }

          const participations = selectedCountry.participations;
          this.years = participations.map((p) => p.year);
          this.medals = participations.map((p) => p.medalsCount);

          this.titlePage = selectedCountry.country;
          this.totalEntries = participations.length;
          this.totalMedals =
            this.statisticsService.getTotalMedals(participations);
          this.totalAthletes =
            this.statisticsService.getTotalAthletes(participations);
          this.updateHeader(participations);
        },
        error: (err: HttpErrorResponse) => {
          // Si les données manquantes : redirection vers la page not-found
          this.router.navigate(['/not-found']);
        },
      });
    this.subscriptions.add(sub);
  }

  // Méthode appelée lors de la destruction du composant
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
