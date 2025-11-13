import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Olympic } from '../../models/olympic.model';
import { DataService } from 'src/app/services/data.service';
import { StatisticsService } from 'src/app/services/statistics.service';
import { MedalsPieChartComponent } from 'src/app/components/medals-pie-chart/medals-pie-chart.component';
import {
  HeaderComponent,
  HeaderIndicator,
} from 'src/app/components/header/header.component';
import { ErrorNavigationService } from 'src/app/services/error-navigation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MedalsPieChartComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  // Variables header
  public headerTitle = 'Medals per Country';
  public headerIndicators: HeaderIndicator[] = [];

  // Variables pour le graphique
  public countries: string[] = [];
  public sumOfAllMedalsYears: number[] = [];
  public countryIds: number[] = [];

  // variables statistiques
  public totalCountries = 0;
  public totalJOs = 0;

  // Conteneur de toutes les subscriptions du composant
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly dataService: DataService,
    private readonly statisticsService: StatisticsService,
    private readonly errorNav: ErrorNavigationService,
  ) {}

  // Initialisation du composant
  ngOnInit(): void {
    const olympicsSub = this.dataService.getOlympics().subscribe({
      next: (data: Olympic[]) => {
        if (!data || data.length === 0) {
          // En cas de données manquantes ou vides
          this.errorNav.triggerError('missing-data');
          return;
        }
        this.totalJOs = this.statisticsService.getTotalJOs(data);
        this.countries = data.map((o) => o.country);
        this.countryIds = data.map((o) => o.id);

        this.totalCountries = this.statisticsService.getTotalCountries(data);
        this.sumOfAllMedalsYears = data.map((o) =>
          this.statisticsService.getTotalMedals(o.participations),
        );

        // Mise à jour des indicateurs du header
        this.updateHeader();
      },

      // Gestion des erreurs lors de la récupération des données
      error: (error: HttpErrorResponse) => {
        this.errorNav.triggerError('missing-data');
      },
    });

    this.subscriptions.add(olympicsSub);
  }

  // Méthode pour mettre à jour les indicateurs du header
  private updateHeader(): void {
    this.headerIndicators = [
      { label: 'Number of countries', value: this.totalCountries },
      { label: 'Number of JOs', value: this.totalJOs },
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
