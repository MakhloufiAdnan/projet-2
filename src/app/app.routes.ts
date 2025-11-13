import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CountryComponent } from './pages/country/country.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'country/:id',
    component: CountryComponent,
  },

  // page Not Found
  {
    path: 'not-found',
    component: NotFoundComponent,
  },

  // toute URL inconnue → NotFound avec type d'erreur "bad-url", évite l'écran vide
  {
    path: '**',
    component: NotFoundComponent,
    data: { errorType: 'bad-url' },
  },
];
