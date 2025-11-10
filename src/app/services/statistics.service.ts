import { Injectable } from '@angular/core';
import { Olympic } from '../models/olympic.model';
import { Participation } from '../models/participation.model';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  getTotalCountries(olympics: Olympic[]): number {
    return olympics.length;
  }

  getTotalJOs(olympics: Olympic[]): number {
    const allParticipations = olympics.flatMap((o) => o.participations);
    return new Set(allParticipations.map((p: Participation) => p.year)).size;
  }

  getTotalMedals(participations: Participation[]): number {
    return participations.reduce((acc, p) => acc + p.medalsCount, 0);
  }

  getTotalAthletes(participations: Participation[]): number {
    return participations.reduce((acc, p) => acc + p.athleteCount, 0);
  }
}
