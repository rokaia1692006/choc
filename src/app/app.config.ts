import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { USE_MOCK } from './core/api.config';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { mockInterceptor } from './core/interceptors/mock.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors(USE_MOCK ? [mockInterceptor, apiInterceptor] : [apiInterceptor])),
  ],
};
