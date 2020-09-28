import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbSidebarModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HomePageRoutingModule } from './home-page-routing.module';
import { IssuesComponent } from './issues/issues.component';


@NgModule({
  declarations: [HomePageComponent, IssuesComponent],
  imports: [
    CommonModule,
    NbLayoutModule,
    NbEvaIconsModule,
    NbSidebarModule.forRoot(), // if this is your app.module
    NbButtonModule,
    NbIconModule,
    HomePageRoutingModule,
    NbListModule,
    NbCardModule,
    NbInputModule
  ]
})
export class HomePageModule { }
