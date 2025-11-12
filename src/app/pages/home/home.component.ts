import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Olympic } from '../../models/olympic.model';
import { DataService } from 'src/app/services/data.service';
import { StatisticsService } from 'src/app/services/statistics.service';
import { MedalsPieChartComponent } from 'src/app/components/medals-pie-chart/medals-pie-chart.component';
import { HeaderComponent, HeaderIndicator } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MedalsPieChartComponent,
    HeaderComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {

  // Variables header
  public headerTitle = 'Medals per Country';
  public headerIndicators: HeaderIndicator[] = [];

  public countries: string[] = [];
  public sumOfAllMedalsYears: number[] = [];
  public totalCountries = 0;
  public totalJOs = 0;
  public error = '';

  private updateHeader(): void {
    this.headerIndicators = [
      { label: 'Number of countries', value: this.totalCountries },
      { label: 'Number of JOs', value: this.totalJOs },
    ];
  }
  
  constructor(
    private readonly dataService: DataService,
    private readonly statisticsService: StatisticsService,
  ) {}

  ngOnInit(): void {
    this.dataService.getOlympics().subscribe({
      next: (data: Olympic[]) => {
        if (!data || data.length === 0) {
          this.error = 'No data available';
          return;
        }

        this.totalJOs = this.statisticsService.getTotalJOs(data);
        this.countries = data.map((o) => o.country);
        this.totalCountries = this.statisticsService.getTotalCountries(data);
        this.sumOfAllMedalsYears = data.map((o) =>
          this.statisticsService.getTotalMedals(o.participations),
        );
        this.updateHeader();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des données', error);
        this.error = error.message;
      },
    });
  }
}
