import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstPageComponent } from './first-page/first-page.component'
import { InitialComponent } from './initial/initial.component'
import { WelcomeComponent } from './welcome/welcome.component'
import { InformationComponent } from './information/information.component'
import { CourseFilesComponent } from './course-files/course-files.component'
import { AuthGuard } from './_helpers';

const routes: Routes = [
  { path: '', component: FirstPageComponent, pathMatch: 'full' },
  { path: 'login', component: InitialComponent },
  { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },
  { path: 'student-files/:teacher/:path', component: CourseFilesComponent, canActivate: [AuthGuard] },
  { path: 'info', component: InformationComponent, canActivate: [AuthGuard] },
  
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
