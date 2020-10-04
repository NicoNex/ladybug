import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbContextMenuModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbMenuModule, NbSidebarModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HomePageRoutingModule } from './home-page-routing.module';
import { IssuesComponent } from './issues/issues.component';
import { NewComponent } from './new/new.component';
import { IssueModule } from './issues/issue.module';
import { NewModule } from './new/new.module';




@NgModule({
  declarations: [HomePageComponent, IssuesComponent, NewComponent],
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
    IssueModule,
    NewModule
  ]
})
export class HomePageModule { }
