import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FilesComponent} from './files/files.component';
import {InformationComponent} from './information/information.component';
import {IndexComponent} from './index/index.component';
import {OfficeComponent} from './office.component';

const routes: Routes = [
  {path: '', component: IndexComponent, pathMatch: 'full'},
  {path: 'information', component: InformationComponent},
  {path: 'files', component: FilesComponent},
  {path: 'files/:teacher/:path', component: FilesComponent},

  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: OfficeComponent,
      children: routes
    }
  ])],
  exports: [RouterModule]
})
export class OfficeRoutingModule {
}
