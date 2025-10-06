import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// This should be the only content. No providers here.
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));