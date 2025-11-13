import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorType } from '../models/error-page.model';

@Injectable({
  providedIn: 'root',
})
export class ErrorNavigationService {
  // Type d'erreur courant mémorisé dans le service
  private currentErrorType: ErrorType = 'unknown';

  constructor(private readonly router: Router) {}
  //Passe un type d'erreur, le mémorise,
  // puis navigue vers la page not-found
  triggerError(type: ErrorType): void {
    this.currentErrorType = type;
    this.router.navigate(['/not-found']);
  }

  // Permet à la page Not Found de récupérer le type courant
  getCurrentErrorType(): ErrorType {
    return this.currentErrorType;
  }
}
