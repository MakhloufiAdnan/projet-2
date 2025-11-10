import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Olympic } from '../../models/olympic.model';
import { OlympicService } from 'src/app/services/olympic.service';
import { StatisticsService } from 'src/app/services/statistics.service';
import { MedalsPieChartComponent } from 'src/app/components/medals-pie-chart/medals-pie-chart.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MedalsPieChartComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public countries: string[] = [];
  public sumOfAllMedalsYears: number[] = [];
  public totalCountries = 0;
  public totalJOs = 0;
  public error = '';
  public titlePage = 'Medals per Country';

  constructor(
    private readonly olympicService: OlympicService,
    private readonly statisticsService: StatisticsService,
  ) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe({
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
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des données', error);
        this.error = error.message;
      },
    });
  }
}
