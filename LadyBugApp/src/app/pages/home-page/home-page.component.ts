import { Component, OnInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(private sidebarService: NbSidebarService) { }

  ngOnInit(): void {}

  toggleCompact(): void {
    this.sidebarService.toggle(true, 'left');
  }

}
