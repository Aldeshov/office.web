import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {IndexComponent} from './index/index.component';
import {WelcomeComponent} from './welcome.component';

const routes: Routes = [
  {path: '', component: IndexComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent},

  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: WelcomeComponent,
      children: routes
    }
  ])],
  exports: [RouterModule]
})
export class WelcomeRoutingModule {
}
