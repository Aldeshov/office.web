import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FirstPageComponent } from './first-page/first-page.component'
import { InitialComponent } from './initial/initial.component'
import { WelcomeComponent } from './welcome/welcome.component'
import { InformationComponent } from './information/information.component'
import { CourseFilesComponent } from './course-files/course-files.component'

const routes: Routes = [
  { path: '', component: FirstPageComponent, pathMatch: 'full' },
  { path: 'login', component: InitialComponent, pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent, pathMatch: 'full' },
  { path: 'student-files', component: CourseFilesComponent, pathMatch: 'full' },
  { path: 'info', component: InformationComponent, pathMatch: 'full' }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
