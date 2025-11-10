import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { enableProdMode } from '@angular/core';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { routes } from './app/app.routes';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()],
})
  // NOSONAR
  .catch((err) => console.error(err));
