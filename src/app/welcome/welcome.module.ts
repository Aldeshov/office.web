import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {WelcomeRoutingModule} from './welcome-routing.module';
import {WelcomeComponent} from './welcome.component';
import {LoginComponent} from './login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbMenuModule
} from '@nebular/theme';
import {IndexComponent} from './index/index.component';
import {NbEvaIconsModule} from '@nebular/eva-icons';


@NgModule({
  declarations: [
    LoginComponent,
    WelcomeComponent,
    IndexComponent,
  ],
  imports: [
    CommonModule,
    WelcomeRoutingModule,
    ReactiveFormsModule,
    NbMenuModule.forRoot(),
    NbCardModule,
    NbLayoutModule,
    NbInputModule,
    NbFormFieldModule,
    NbIconModule,
    NbButtonModule,
    NbAlertModule,
  ],
  bootstrap: [WelcomeComponent]
})
export class WelcomeModule {
}
