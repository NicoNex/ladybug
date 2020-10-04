import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page.component';
import { NewIssueComponent } from './issues/new-issue/new-issue.component';


// const routes: Routes = [
//   { path: '', redirectTo: '/home', pathMatch: 'full' },
//   { path: 'home', component: HomePageComponent }];

const routes: Routes = [
  { 
    path: '', component: HomePageComponent,
    children: [
      { path: 'new', component: NewIssueComponent}
    ]
  }
  
  // { path: 'detail/:id', }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }