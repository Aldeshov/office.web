import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OfficeRoutingModule} from './office-routing.module';
import {FilesComponent} from './files/files.component';
import {ScheduleComponent} from './index/schedule/schedule.component';
import {NewsComponent} from './index/news/news.component';
import {TitleComponent} from './index/title/title.component';
import {SearchComponent} from './search/search.component';
import {InformationComponent} from './information/information.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {OfficeComponent} from './office.component';
import {IndexComponent} from './index/index.component';
import {
  NbButtonModule,
  NbCardModule,
  NbContextMenuModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbMenuModule,
  NbSearchModule,
  NbSidebarModule,
  NbSpinnerModule,
  NbUserModule
} from '@nebular/theme';
import {WelcomeTextPipe} from '../shared/pipes/welcome-text.pipe';


@NgModule({
  declarations: [
    OfficeComponent,
    InformationComponent,
    FilesComponent,
    ScheduleComponent,
    NewsComponent,
    TitleComponent,
    SearchComponent,
    IndexComponent,
    WelcomeTextPipe,
  ],
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    OfficeRoutingModule,
    NbLayoutModule,
    NbButtonModule,
    NbInputModule,
    NbIconModule,
    NbSearchModule,
    NbCardModule,
    NbListModule,
    NbSpinnerModule,
    NbUserModule,
    NbContextMenuModule,
    NbSidebarModule,
    NbMenuModule,
  ],
})
export class OfficeModule {
}
