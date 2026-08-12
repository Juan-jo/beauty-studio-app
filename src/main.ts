import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { BeautyApp } from './app/app';

bootstrapApplication(BeautyApp, appConfig)
  .catch((err) => console.error(err));