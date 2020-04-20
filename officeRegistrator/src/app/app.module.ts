import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS }    from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { InitialComponent } from './initial/initial.component';
import { AppRoutingModule } from './app-routing.module';
import { FirstPageComponent } from './first-page/first-page.component';
import { CourseFilesComponent } from './course-files/course-files.component';
import { HeaderComponent } from './header/header.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { NewsComponent } from './news/news.component';
import { TitleComponent } from './title/title.component';
import { SearchComponent } from './search/search.component';
import { InformationComponent } from './information/information.component';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    InitialComponent,
    FirstPageComponent,
    CourseFilesComponent,
    HeaderComponent,
    ScheduleComponent,
    NewsComponent,
    TitleComponent,
    SearchComponent,
    InformationComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule
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
  bootstrap: [AppComponent]
})
export class AppModule { }
