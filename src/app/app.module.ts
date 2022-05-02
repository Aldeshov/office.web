import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {JwtInterceptor} from './shared/interceptors/jwt.interceptor';
import {ErrorInterceptor} from './shared/interceptors/error.interceptor';
import {RouterModule} from '@angular/router';
import {AuthGuard} from './shared/guards/auth.guard';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NbMenuModule, NbSidebarModule, NbThemeModule} from '@nebular/theme';
import {NbEvaIconsModule} from '@nebular/eva-icons';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/welcome',
        pathMatch: 'full',
      },
      {
        path: 'office',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () => import('./office/office.module').then(module => module.OfficeModule),
      },
      {
        path: 'welcome',
        loadChildren: () => import('./welcome/welcome.module').then(module => module.WelcomeModule),
      }
    ], {
      onSameUrlNavigation: 'reload'
    }),
    NbThemeModule.forRoot({name: 'dark'}),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbEvaIconsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
