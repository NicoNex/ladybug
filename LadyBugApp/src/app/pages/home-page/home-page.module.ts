import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbContextMenuModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbMenuModule, NbSidebarModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HomePageRoutingModule } from './home-page-routing.module';
import { IssuesComponent } from './issues/issues.component';
import { NewIssueComponent } from './issues/new-issue/new-issue.component';




@NgModule({
  declarations: [HomePageComponent, IssuesComponent, NewIssueComponent],
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
    NbInputModule,
    NbMenuModule.forRoot(),
    NbContextMenuModule,
    NbCheckboxModule,
  ]
})
export class HomePageModule { }
