import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ErrorNavigationService } from 'src/app/services/error-navigation.service';
import { ErrorPageConfig, ErrorType } from 'src/app/models/error-page.model';
import { getErrorPageConfigByType } from 'src/app/config/error-page.config';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent implements OnInit {
  public errorTitle = '';
  public errorMessage = '';

  constructor(
    private readonly errorNav: ErrorNavigationService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Récupère le type d'erreur courant depuis le service
    const serviceType: ErrorType = this.errorNav.getCurrentErrorType();

    // Récupère le type d'erreur éventuel depuis la route
    // (cas des URL inconnues : '**' → bad-url)
    const routeType = this.route.snapshot.data?.['errorType'] as
      | ErrorType
      | undefined;

    // Choisit le type effectif :
    //    - si le service a un type différent de 'unknown', on le privilégie
    //    - sinon on utilise celui de la route
    //    - sinon 'unknown'
    const effectiveType: ErrorType =
      serviceType === 'unknown' ? (routeType ?? 'unknown') : serviceType;

    // Récupère la configuration d'erreur correspondante
    const config: ErrorPageConfig = getErrorPageConfigByType(effectiveType);

    // Affecte les valeurs au template
    this.errorTitle = config.title;
    this.errorMessage = config.message;
  }
}
