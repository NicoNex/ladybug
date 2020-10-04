import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from '../home-page.component';
import { IssuesComponent } from './issues.component';

const routes: Routes = [
  {
    path: 'issue',
    component: HomePageComponent,
    children: [
      {
        path: '', component: IssuesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssueRoutingModule { }
