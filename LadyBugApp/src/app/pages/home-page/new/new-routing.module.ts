import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from '../home-page.component';
import { NewComponent } from './new.component';

const routes: Routes = [
  {
    path: 'new',
    component: HomePageComponent,
    children: [
      { path: '', component: NewComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewRoutingModule { }
